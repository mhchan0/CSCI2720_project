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

    useEffect(() => {
        const payload = {
            locid: loc
        }

        if (isNaN(loc)) {
            window.location.replace("http://localhost:3000/dashboard/location");
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
            }

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
        })
        .catch((err) => {
            window.location.replace("http://localhost:3000/dashboard/location");
        });
    })

    let clickStar = (e) => {
        let element = document.querySelector("#star");
        if (!isFavourite) {
            setFavourite(true);
        }
        else {
            setFavourite(false);
        }
    }

    return (
		<main className="col">
            <div className="my-3 d-flex justify-content-between">
                {locData.name && <h2 className="text-primary">{locData.name}</h2>}
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

export default ALocation;
