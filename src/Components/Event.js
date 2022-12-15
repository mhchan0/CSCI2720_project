import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            locationList: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {

    }



    render() {

        let username = sessionStorage.getItem("username");
        if (username === null) {
			window.location.replace("http://localhost:3000/");
		}

        return (
            <main className="col">
                <div className="my-3 d-flex justify-content-between">
                    <h2 className="text-primary">Event Data</h2>
                    <h3 ><b className="text-primary">{username}</b>&nbsp;<i className="bi bi-person-circle"></i></h3>
                </div>
                <div>
                    
                </div>
            </main>
        );
    }
}

export default Event;