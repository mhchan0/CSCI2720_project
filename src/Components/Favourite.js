import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

class Favourite extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			locationList: 
		}
	}

    Loadlocation() {
        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/location/fav",
            method: "GET",
        })
        .then((r) => {
            this.setState({
                locationList: r.data
            });
        })
    }
	
	window.addEventListener("onload", (e) => {
		let fieldArea = document.getElementById("favLocationList");
		var favList = this.locationList;
		let locList = document.createElement("ul");
		locList.setAttribute("id", "locList");
		favList.map((arr) => {
			let locItem = document.createElement("li");
			locItem.value = arr;
			locList.appendChild(locItem);
		});
		fieldArea.appendChild(locList);
		}
	)

    render() {

        let username = sessionStorage.getItem("username");
        if (username === null) {
			window.location.replace("http://localhost:3000/");
		}

        return (
			<main className="col">
				<div className="my-3 d-flex justify-content-between">
                    <h2 className="text-primary">Favourite</h2>
                    <h3 ><b className="text-primary">{username}</b>&nbsp;<i className="bi bi-person-circle"></i></h3>
                </div>
				<div id="favLocation" className="my-3 d-flex justify-content-between">
				</div>
            </main>
        );
    }
}

export default Favourite;
