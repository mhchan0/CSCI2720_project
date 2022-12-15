import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Map from "./Map.js"

class ALocation extends Component {
    
    render() {

        let username = sessionStorage.getItem("username");
        if (username === null) {
			window.location.replace("http://localhost:3000/");
		}

        return (
			<main className="col">
                <div className="my-3 d-flex justify-content-between">
                    <h2 className="text-primary">Location name</h2>
                    <h3 ><b className="text-primary">{username}</b>&nbsp;<i className="bi bi-person-circle"></i></h3>
                </div>

                <Map lng={114.177216} lat={22.302711} zoom={10}/>
            </main>
            
        );
    }
}

export default ALocation;
