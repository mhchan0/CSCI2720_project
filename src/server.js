/*
 * CSCI2720/ESTR2106 Course Project
 * A Social Map of Events
 *
 * We declare that the assignment here submitted is original
 * except for source material explicitly acknowledged,
 * and that the same or closely related material has not been
 * previously submitted for another course.
 * We also acknowledge that we are aware of University policy and
 * regulations on honesty in academic work, and of the disciplinary
 * guidelines and procedures applicable to breaches of such
 * policy and regulations, as contained in the website.
 *
 * University Guideline on Academic Honesty:
 *   http://www.cuhk.edu.hk/policy/academichonesty
 * Faculty of Engineering Guidelines to Academic Honesty:
 *   https://www.erg.cuhk.edu.hk/erg/AcademicHonesty
 *
 * Student Name: Lam Ching Hui, Xu Yu On, Tang Suet Yi, Lo Ka Wai, Chan Man Ho, Lee Yan Hin
 * Student ID  : 1155176763, 1155157363, 1155177062, 1155157996, 1155144075, 1155144079,
 * Date        : 17/12/2022
 */
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
    location : { type: Schema.Types.ObjectId, ref: "Location" },
    body: { type: String, required: true }
});

const Access = mongoose.model("Access", LoginAccessSchema);
const Location = mongoose.model("Location", LocationSchema);
const Programme = mongoose.model("Programme", ProgrammeSchema);
const Comment = mongoose.model("Comment", CommentSchema);

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

// get a user data
app.post("/auser", (req, res) => {
    Access.find({
        username: req.body["username"]
    }, (err, e) => {
        if (err || e === null) {
            res.status(404);
            res.send(err);
        }
        else {
            res.status(200);
            res.send(e);
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

// find locations by objectId
app.post('/locationbyid', (req, res) => {
    Location.find({
        _id: { $in : req.body["loc_id"]}
    }, (err, e) => {
        if (err) {
            res.send(err);
        }
        else {
            res.status(200);
            res.send(e);
        }
    })
})

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

//get event data by objectId
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

// get comments
app.post('/comments', (req, res) => {
    Comment.find({
        location: req.body["locid"]
    })
    .populate("location user")
    .exec((err, e) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(e);
        }
    });
});

// add comment
app.post('/addcomment', (req, res) => {
    Access.findOne({
        username: req.body["username"]
    })
    .exec((err, e) => {
        if (err) {
            res.status(406);
            res.send();
        }
        else if (e === null) {
            res.status(406);
            res.send();
        }
        else {
            Comment.create({
                user: e._id,
                location: req.body["locid"],
                body: req.body["comment"]
            }, (err2 => {
                if (err2) {
                    res.status(406);
                    res.send();
                }
                else {
                    res.status(200);
                    res.send();
                }
            }))
        }
    });
});



//get all events
app.post('/events', (req, res) => {
    Programme.find({}, (err, e) => {
        if (err) {
            res.send(err);
        }
        else {
            //console.log(e);
            let events = e;
            let a = 0;
            let b = 0;
            let list = [];
            let list2 = [];
            let list3 = [];
            e.map((value, index) => {
                list.push(value.venue);
            })
            function asyncLoop( i = 0, callback ) {
                if( i < list.length ) {
                    let isnum = /^\d+$/.test(list[i]);
                    if (!isnum){
                        let str = "No such location";
                        list2.push(str);
                        asyncLoop( i+1, callback );
                    }else{
                        Location.findOne({ locid: list[i] }, "locid name", (err, ee)=> {
                            if (err) {console.log(err);}
                            else {
                                //console.log(ee);
                                if (ee == null){
                                    let str = "No such location";
                                    list2.push(str);
                                }else{
                                    list2.push(ee.name);
                                    //console.log(typeof(str));
                                }
                                
                                //events[i]["locname"] = ee.name;
                                asyncLoop( i+1, callback );
                            }
                        })
                    }
                    
                } else {
                    callback();
                }
            }
            asyncLoop( 0, function() {
                
                list3.push(events);
                list3.push(list2);
                res.status(200);
                res.send(list3);

            });
            
        }
    });
});

//create new event
app.post('/newevent', (req, res) => {
    Programme.create({
        title: req.body['title'],
        venue: req.body['venue'],
        date: req.body['date'],
        description: req.body['description'],
        price: req.body['price'],
        presenter: req.body['presenter']
    }, (err, e) => {
        if (err) {
            res.status(406);
            res.send();
        }
        else {
            res.status(201);
            res.send();
        }
    })
});

//delete one event
app.delete('/deleteevent', (req, res) => {
    Programme.deleteOne({
        title: req.body['title'],
        venue: req.body['venue'],
        date: req.body['date'],
        description: req.body['description'],
        price: req.body['price'],
        presenter: req.body['presenter']
    }, (err, e) => {
        if (err) {
            res.status(406);
            res.send();
        }
        else {
            res.status(201);
            res.send();
        }
    })
})

//update one event
app.post('/updateevent', (req, res) => {
    Programme.findOneAndUpdate({
        _id: req.body["id"]
    }, {
        title: req.body['title'],
        venue: req.body['venue'],
        date: req.body['date'],
        description: req.body['description'],
        price: req.body['price'],
        presenter: req.body['presenter']
    }, null,(err, e) => {
        if (err) {
            res.status(406);
            res.send();
        }
        else {
            res.status(200);
            res.send();
        }
    })
});

var file_dir_xml = __dirname + '/XMLfiles/';
updateEvents = (res) => {
    var url = 'https://www.lcsd.gov.hk/datagovhk/event/events.xml';
    var file_name = 'events.xml';
    var parser = new xml2js.Parser();
    var file = fs.createWriteStream(file_dir_xml + file_name, {'flags': 'w'});
    const get = https.get(url, (response) => {
        var stream = response.pipe(file);
        stream.on('finish', ()=> {//wait file get all data
            fs.readFile(file_dir_xml + file_name, (err, data) => {
                parser.parseString(data, (err, result) => {
                    //console.dir(result.events.event);

                        let totalLength = 0;
                        let currentLength = 0;

                        for (i of result.events.event) {
                            if (i.presenterorge[0] !== '' && i.titlee[0] !== '' && i.pricee[0] !== '' && i.predateE[0] !== '') {
                                totalLength++;
                            }
                        }

                        result.events.event.map((value, index) => {
                            //if (value.desce[0] == ''){console.log(value.titlee[0]);}
                            if (value.presenterorge[0] !== '' && value.titlee[0] !== '' && value.pricee[0] !== '' && value.predateE[0] !== '') {
                                //console.log(value);
                                Location.findOne({// find one loc
                                    locid: value.venueid
                                },(err, e)=> {
                                    if (e == null){//if no such place in db, skip
                                        currentLength++;
                                        if (currentLength >= totalLength) {
                                            res.status(200);
                                            res.send();
                                        }
                                        //console.log(value.titlee);
                                    }else {
                                        Programme.findOne({
                                            title: value.titlee[0],
                                        }, (err, ee)=>{

                                            if (err){
                                                res.send(err);
                                            }
                                            else if (ee === null) {
                                                Programme.create({
                                                    title: value.titlee[0],
                                                    venue: e.locid,
                                                    date: value.predateE[0],// if u want to change the type to Date, change it
                                                    description:  value.desce[0] == ''?'N/A':value.desce[0],
                                                    price: value.pricee[0],
                                                    presenter: value.presenterorge[0]
                                                }, (err2, eee) => {
                                                    Location.updateOne({locid: e.locid}, { $push: { programme: eee._id } }, (err3, eeee)=> {
                                                        if (err){
                                                            res.send(err);
                                                        }
                                                        currentLength++;
                                                        if (currentLength >= totalLength) {
                                                            res.status(200);
                                                            res.send();
                                                        }
                                                    });
                                                })
                                            }
                                            else {
                                                currentLength++;
                                                if (currentLength >= totalLength) {
                                                    res.status(200);
                                                    res.send();
                                                }
                                            
                                            }
                                        })
                                        
                                        //console.log("done" + index);
                                    }
                                    //console.log(e);
                                })
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
    var lastmap = 0;
    var file2 = fs.createWriteStream(file_dir_xml + file_name2, {'flags': 'w'});
    const get2 = https.get(url2, (response) => {
        var stream = response.pipe(file2);
        stream.on('finish', ()=> {//wait file get all data
            fs.readFile(file_dir_xml + file_name2, (err, data) => {
                parser.parseString(data, (err, result) => {
                    //console.dir(result.venues.venue[0].$.id);
                        let totalLength = 0;
                        for (i of result.venues.venue) {
                            if (i.latitude[0] !== '' && i.longitude[0] !== '') {
                                totalLength++;
                            }
                        }

                        let currentLength = 0;
                        result.venues.venue.map((value, index) => {//have url of event
                            if (value.latitude[0] !== '' && value.longitude[0] !== '') {
                                
                                Location.findOneAndUpdate({
                                    locid: value.$.id,
                                }, {
                                    locid: value.$.id,
                                    name: value.venuee[0],
                                    latitude: value.latitude[0],
                                    longitude: value.longitude[0]
                                }, {
                                    upsert: true
                                }, (err,e) => {
                                    currentLength++;
                                    if (currentLength >= totalLength) {
                                        updateEvents(res);
                                    }
                                });        
                                    
                            };
                            
                        });
                   
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

// add or remove user favourite
app.post('/fav', (req, res) => {
    Location.findOne({
        locid: req.body["locid"]
    }, (err, e) => {
        if (err || e === null) {
            res.status(406);
            res.send();
        }
        else {
            if (req.body["fav"] === true) {
                Access.findOne({
                    username: req.body["username"]
                }, (err2, e2) => {
                    if (err2 || e2 === null) {
                        res.status(406);
                        res.send();
                    }
                    else {
                        let favList = e2.favouriteLocation;
                        if (!favList.includes(e._id)) {
                            favList.push(e._id);
                        }
                        e2.favouriteLocation = favList;
                        e2.save();
                        res.status(200);
                        res.send();
                    }
                })
            }
            else {
                Access.findOne({
                    username: req.body["username"]
                }, (err2, e2) => {
                    if (err2 || e2 === null) {
                        res.status(406);
                        res.send();
                    }
                    else {
                        let favList = [];
                        for (i of e2.favouriteLocation) {

                            if (String(i) !== String(e._id)) {
                                favList.push(i);
                            }
                        }
                        e2.favouriteLocation = favList;
                        e2.save();
                        res.status(200);
                        res.send();
                    }
                })
            }
        }
    })
})

app.listen(8080);
