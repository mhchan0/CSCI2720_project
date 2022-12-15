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
name: { type: String, required: true },
latitude: { type: Number, required: true },
longitude: {type: Number, required: true },
programme: [{ type: Schema.Types.ObjectId, ref: "Programme" }]
});

const ProgrammeSchema = new Schema({
title:{type: String, required: true },
venue:{type: String, required: true },
date:{type: Date, required: true },
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
//not done
app.get('/location/loc1', (req,res) => { 
        Location.findOne({name: "Sha Tin Town Hall (Auditorium)"})
        .exec(function (err, e) {
            if (err)
                res.send(err);
            else {
                if (e==null) {
                    res.status(404).send();
                }
                else {
                    res.send(JSON.stringify(obj, null, 0.5));
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

var file_dir_xml = __dirname + '/XMLfiles/';
//down and put xml to db
updateEvents = () => {
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
                    result.events.event.map((value, index) => {//have url of event
                        if (value.pricee != '' && value.desce != ''){
                            //console.log(value);
                        }
                        
                    });
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
    var file2 = fs.createWriteStream(file_dir_xml + file_name2, {'flags': 'w'});
    const get2 = https.get(url2, (response) => {
        var stream = response.pipe(file2);
        console.log('saved file2 in XMLfiles!');
        stream.on('finish', ()=> {//wait file get all data
            fs.readFile(file_dir_xml + file_name2, (err, data) => {
                parser.parseString(data, (err, result) => {
                    //console.dir(result);
                    if (err){console.log(err);}
                    Location.deleteMany({}, (err, e)=>{
                        if (err) {console.log(err)}
                        else {
                            result.venues.venue.map((value, index) => {//have url of event
                                if (value.latitude != '' && value.longitude != ''){
                                    //console.log(value);
                                        Location.create({
                                            name: value.venuee[0],
                                            latitude: value.latitude[0],
                                            longitude: value.longitude[0]
                                        }, (err, e) => {
                                            if (err){
                                                console.log(err);
                                            }else {
                                                res.send();
                                            }
                                        })
                                };
                                
                            });
                        }
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

app.listen(8080);
