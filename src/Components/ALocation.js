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
 * Date        : xxx <fill in yourself>
 */
import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Map from "./Map.js"

function ALocation() {
    
    let username = sessionStorage.getItem("username");
    if (username === null) {
		window.location.replace("http://localhost:3000/");
	}

    const { loc } = useParams();
    const [locData, setLocData] = useState({});
    const [isFavourite, setFavourite] = useState(false);
    const [eventList, setEventList] = useState([]);
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {

        if (isNaN(loc)) {
            window.location.replace("http://localhost:3000/dashboard/location");
        }

        loadData();
    })

    let loadData = () => {
        const payload = {
            locid: loc
        }

        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/alocation",
            method: "POST",
            data: payload
        })
        .then((e) => {
            const eventPayload = {
                id: e.data.programme
            };

            setLocData(e.data);
            axios({
                // need change localhost to the publicIP
                url: "http://localhost:8080/eventbyid",
                method: "POST",
                data: eventPayload
            })
            .then(e2 => {
                setEventList(e2.data);
            })
            .catch(err2 => {
                console.log("Internal server error");
            })

            const locidPayload = {
                locid: e.data._id
            };

            axios({
                // need change localhost to the publicIP
                url: "http://localhost:8080/comments",
                method: "POST",
                data: locidPayload
            })
            .then(e3 => {
                setCommentList(e3.data);
            })
            .catch(err3 => {
                console.log("Internal server error");
            })

            const usernamePayload = {
                username: username
            }

            axios({
                // need change localhost to the publicIP
                url: "http://localhost:8080/auser",
                method: "POST",
                data: usernamePayload
            })
            .then((e3) => {
                
                if (e3.data[0].favouriteLocation.includes(e.data._id)) {
                    setFavourite(true);
                }
                
            })
            .catch((err3) => {
                console.log("Internal server error");
            });

        })
        .catch((err) => {
            window.location.replace("http://localhost:3000/dashboard/location");
        });
        
    }

    let clickStar = () => {
        
        if (!isFavourite) {
            setFavourite(true);
        }
        else {
            setFavourite(false);
        }

        const payload = {
            username: sessionStorage.getItem("username"),
            locid: loc,
            fav: !isFavourite
        }

        axios({
            url: "http://localhost:8080/fav",
            method: "POST",
            data: payload
        })
        .then(() => {})
        .catch((err) => {
            console.log("Internal server error");
        });
    }

    let validateComment = (e) => {
        if (e.target.value !== "") {
            e.target.classList.remove("is-invalid");
            document.querySelector("#" + e.target.id + "-invalid").innerText = "";
        }
        else {
            e.target.classList.add("is-invalid");
            document.querySelector("#" + e.target.id + "-invalid").innerText = "Please fill out this field";
        }
    }

    let SubmitComment = () => {
        let element = document.querySelector("#new-comment");
        if (element.value === "") {
            element.classList.add("is-invalid");
            document.querySelector("#new-comment-invalid").innerText = "Please fill out this field";
        }
        else {
            const payload = {
                username: username,
                locid: locData._id,
                comment: element.value
            };

            axios({
                // need change localhost to the publicIP
                url: "http://localhost:8080/addcomment",
                method: "POST",
                data: payload
            })
            .then((r) => {
                loadData();
                element.value = "";
            })
            .catch((err) => {
                console.log("Internal server error");
            });
        }
    }

    let expandNavbar = () => {
        document.querySelector("#navbar-full").style.display = "block";
    }

    return (
		<main className="col">
            <div className="my-3 d-flex justify-content-between">
                <span>
                        <span id="navbar-button">
                            <button type="button" className="btn btn-primary"><i className="bi bi-caret-right-fill" onClick={()=>expandNavbar()}></i></button>&nbsp;
                        </span>
                {locData.name && <h2 className="text-primary">{locData.name}</h2>}
                </span>
                <h3><b className="text-primary">{username}</b>&nbsp;<i className="bi bi-person-circle"></i></h3>
            </div>

            <div className="container row">
                <div className="col-8">
                    {locData.longitude && locData.latitude && <Map lng={locData.longitude} lat={locData.latitude} zoom={15}/>}
                </div>

                <div className="col-4  d-flex justify-content-center">
                    <div className="card">
                        { locData.name && !isFavourite &&
                            <div className="card-header">
                                <h5>
                                    {locData.name}&nbsp;<i id="star" className="bi bi-star-fill text-secondary click-star" onClick={()=>clickStar()}></i>
                                </h5>
                            </div>
                        }
                        { locData.name && isFavourite &&
                            <div className="card-header">
                                <h5>
                                    {locData.name}&nbsp;<i id="star" className="bi bi-star-fill text-warning click-star" onClick={()=>clickStar()}></i>
                                </h5>
                            </div>
                        }
                        <ul className="card-body">
                            {locData.locid && <li className="list-group-item">Location&nbsp;ID: {locData.locid}</li>}
                            <br/>
                            {locData.longitude && <li className="list-group-item">Longitude: {locData.longitude}</li>}
                            <br/>
                            {locData.latitude && <li className="list-group-item">Latitude: {locData.latitude}</li>}
                            <br/>
                            {locData.programme && <li className="list-group-item">Event&nbsp;Number: {locData.programme.length}</li>}
                            <br/>
                            <a href="#comment"><button type="button" className="btn btn-primary">Comment</button></a>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="card my-3">
                <div className="card-header">
                    <h5>Events</h5>
                </div>
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr className="table-secondary">
                                <th>Title</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Presenter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventList.map((event, index) => <EventRow key={index} title={event.title} date={event.date} description={event.description} price={event.price} presenter={event.presenter} />)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="comment" className="card my-3">
                <div className="card-header">
                    <h5>Comments</h5>
                </div>
                <div className="card-body">
                    <label htmlFor="new-comment">Comment</label>
					<textarea id="new-comment" className="form-control" rows="3" placeholder="Comment" style={{resize: "none"}} required onBlur={(e)=>validateComment(e)}></textarea>
					<div id="new-comment-invalid" className="text-danger"></div>
                    <button type="button" className="btn btn-primary my-3 w-100" onClick={()=>SubmitComment()}>Post</button>
                    <hr />
                    <ul className="list-group list-group-flush my-3">
                        {
                            commentList.length === 0 &&
                            <div className="text-muted">There is no comment</div>
                        }
                        {
                            commentList.length !== 0 &&
                            commentList.map((comment, index) => <CommentList key={index} username={comment.user.username} body={comment.body} />)
                        }
                    </ul>

                </div>
            </div>

        </main>
        
    );
}

class EventRow extends Component {

    render() {
        return(
            <tr>
                <td>
                   {this.props.title} 
                </td>
                <td>
                   {this.props.date} 
                </td>
                <td>
                   {this.props.description} 
                </td>
                <td>
                   {this.props.price} 
                </td>
                <td>
                   {this.props.presenter} 
                </td>
            </tr>
        );
    }
}

class CommentList extends Component {

    render() {
        return(
            <li className="list-group-item d-flex">
                <div>
                    <h1><i className="bi bi-person-circle"></i></h1>
                </div>
                <div className="mx-2">
                    <b>{this.props.username}</b>
                    <br/>
                    <p className="text-break">{this.props.body}</p>
                </div>
            </li>
        );
    }
}

export default ALocation;
