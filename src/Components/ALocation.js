import React, { useState, useEffect } from 'react';
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
            setLocData(e.data);
        })
        .catch((err) => {
            window.location.replace("http://localhost:3000/dashboard/location");
        });
    })

    return (
		<main className="col">
            <div className="my-3 d-flex justify-content-between">
                <h2 className="text-primary">{locData.name}</h2>
                <h3 ><b className="text-primary">{username}</b>&nbsp;<i className="bi bi-person-circle"></i></h3>
            </div>
            {locData.longitude && locData.latitude && <Map lng={locData.longitude} lat={locData.latitude} zoom={15}/>}
        </main>
        
    );
}

export default ALocation;
