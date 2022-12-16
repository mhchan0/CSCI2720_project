const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const xml2js = require('xml2js');
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));

const bcrypt = require("bcrypt"); 

mongoose.set('strictQuery', true);
// this is my MongoDB connect string
// you can change it to yours
// you can also keep using mine :(
mongoose.connect('mongodb+srv://stu009:p424894W@cluster0.wenbhsm.mongodb.net/stu009');

const LoginAccessSchema = new Schema({
username: { type: String, unique: true, required: true, minLength: 4, maxLength: 20 },
password: { type: String, required: true},
isAdmin: Boolean,
favouriteLocation: [{ type: Schema.Types.ObjectId, ref: "Location"}],
comments: [{ body: String }],
lastUpdate: { type: Date, default: Date.now }
});

const LocationSchema = new Schema({
locid: { type: Number, required: true },
name: { type: String, required: true },
latitude: { type: Number, required: true },
longitude: {type: Number, required: true },
programme: [{ type: Schema.Types.ObjectId, ref: "Programme" }]
});

const ProgrammeSchema = new Schema({
title:{type: String, required: true },
venue:{type: String, required: true },
date:{type: String, required: true },
description:{type: String, required: true },
price:{type: String, required: true},
presenter:{type: String, required: true }
});

const CommentSchema = new Schema({
user : { type: Schema.Types.ObjectId, ref: "Access" },
body: { type: String, required: true }
});

const Access = mongoose.model("Access", LoginAccessSchema);
const Location = mongoose.model("Location", LocationSchema);
const Programme = mongoose.model("Programme", ProgrammeSchema);
const Comment = mongoose.model("Comment", LoginAccessSchema);

// create a new user
app.post("/newuser", (req, res) => {
    Access.create({
        username: req.body["username"],
        password: bcrypt.hashSync(req.body["password"], 10),
        isAdmin: false
        }, (err) => {
        if (err) {
            res.status(406);
            res.send();
        }
        else {
            res.status(201);
            res.send();
        }
    });
});

// login
app.post("/login", (req, res) => {
    Access.findOne({username: req.body["username"]}, (err, e) => {
        if (err) {
            res.send(err);
        }
        else if (e === null) {
            res.status(401);
            res.send();
        }
        else {
            if (bcrypt.compareSync(req.body["password"], e.password) === "true") {
                res.status(401);
                res.send();
            }
            else {
                res.status(200);
                res.send(e);
            }
        }
    });
});

// get users data
app.post("/users", (req, res) => {
    Access.find({}, (err, e) => {
        if (err) {
            res.send(err);
        }
        else {
            res.status(200);
            res.send(e);
        }
    });
});

// delete user
app.delete('/deleteuser', (req, res) => {
    Access.deleteOne(
        {username: req.body["username"]},
        (err, e) => {
            if (err || e.deletedCount === 0) {
                res.status(404);
                res.send();
            }
            else {
                res.status(204);
                res.send();
            }
        }
    );
});

// update user
app.post('/updateuser', (req, res) => {
    Access.findOneAndUpdate(
        {_id: req.body["id"]},
        {
            username: req.body["username"],
            password: bcrypt.hashSync(req.body["password"], 10)
        },
        null,
        (err) => {
            if (err) {
                res.status(406);
                res.send();
            }
            else {
                res.status(200);
                res.send();
            }
        }
    );
});

//show specific location data
app.post('/alocation', (req,res) => { 
        Location.findOne({locid: req.body["locid"]})
        .exec(function (err, e) {
            if (err)
                res.send(err);
            else {
                if (e==null) {
                    res.status(404).send();
                }
                else {
                    res.status(200);
                    res.send(e);
                }
            }
       });
});

//show all location data
app.post('/location', (req,res) => { 
        Location.find({}, (err, e) => {
            if (err) {
                res.status(404);
                res.send(err);
            }
            else {
                res.status(200);
                res.send(e);
            }
        }
    );
});

// get event data by objectId
app.post('/eventbyid', (req, res) => {
    Programme.find({
        _id: { $in: req.body["id"]}
    }, (err, e) => {
        if (err) {
            res.send(err);
        }
        else {
            res.status(200);
            res.send(e);
        }
    });
});

var file_dir_xml = __dirname + '/XMLfiles/';
//down and put xml to db
updateEvents = (res) => {
    var url = 'https://www.lcsd.gov.hk/datagovhk/event/events.xml';
    var file_name = 'events.xml';
    var parser = new xml2js.Parser();
    var file = fs.createWriteStream(file_dir_xml + file_name, {'flags': 'w'});
    const get = https.get(url, (response) => {
        var stream = response.pipe(file);
        console.log('saved file in XMLfiles!');
        stream.on('finish', ()=> {//wait file get all data
            fs.readFile(file_dir_xml + file_name, (err, data) => {
                parser.parseString(data, (err, result) => {
                    //console.dir(result.events.event);
                    Programme.deleteMany({}, (err, e)=> {//del whole program db
                        result.events.event.map((value, index) => {
                            //if (value.desce[0] == ''){console.log(value.titlee[0]);}
                            if (value.presenterorge[0] != '' && value.titlee[0] != '' && value.pricee[0] != '' && value.predateE[0] != ''){
                                //console.log(value);
                                Location.findOne({// find one loc
                                    locid: value.venueid
                                },(err, e)=> {
                                    if (e == null){//if no such place in db, skip
                                        //console.log(value.titlee);
                                    }else {
                                        Programme.create({//create prog
                                            title: value.titlee[0],
                                            venue: e.locid,
                                            date: value.predateE[0],// if u want to change the type to Date, change it
                                            description:  value.desce[0] == ''?'N/A':value.desce[0],
                                            price: value.pricee[0],
                                            presenter: value.presenterorge[0]
                                        }, (err, ee)=>{
                                            if (err){console.log(err);}
                                            else {
                                                //console.log(ee._id);
                                                Location.updateOne({locid: e.locid}, { $push: { programme: ee._id } }, (err, eee)=> {
                                                    if (err){
                                                        console.log(err);
                                                    }
                                                    res.send();
                                                });
                                            }
                                        })
                                        
                                        //console.log("done" + index);
                                    }
                                    //console.log(e);
                                })
                            }
                        });
                    })
                });
            });
        });
    });
}
app.post('/getXML', (req, res) => {
    
    var url2 = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml';
    //var url3 = 'https://www.lcsd.gov.hk/datagovhk/event/eventDates.xml';
    
    var file_name2 = 'venues.xml';
    //var file_name3 = 'eventDates.xml';
    var parser = new xml2js.Parser();
    //will create if not exist*
    //do location first
    var lastmap = 0;
    var file2 = fs.createWriteStream(file_dir_xml + file_name2, {'flags': 'w'});
    const get2 = https.get(url2, (response) => {
        var stream = response.pipe(file2);
        console.log('saved file2 in XMLfiles!');
        stream.on('finish', ()=> {//wait file get all data
            fs.readFile(file_dir_xml + file_name2, (err, data) => {
                parser.parseString(data, (err, result) => {
                    //console.dir(result.venues.venue[0].$.id);
                    if (err){console.log(err);}
                    Location.deleteMany({})
                    .then((e)=>{
                        result.venues.venue.map(async(value, index) => {//have url of event
                            if (value.latitude != '' && value.longitude != ''){
                                Location.create({
                                    locid: value.$.id,
                                    name: value.venuee[0],
                                    latitude: value.latitude[0],
                                    longitude: value.longitude[0]
                                }, (err, e) => {
                                    if (err){
                                        console.log(err);
                                    }else {
                                        
                                    }
                                })
                            };
                            
                        });

                    })
                    .then(()=> {
                        updateEvents(res);

                    })
                });
            });
        });

    });
    
    // var file3 = fs.createWriteStream(file_dir_xml + file_name3, {'flags': 'w'});
    // const get3 = https.get(url3, (response) => {
    //     var stream = response.pipe(file3);
    //     console.log('saved file3 in XMLfiles!');
    // });
    
});

app.get('/location/fav', (req, res) => {
    Access.findOne({username: sessionStorage.getItem("username")}).exec((err, a) => {
        Location.findOne({})
    })
})

app.listen(8080);
