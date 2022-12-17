import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";

class Favourite extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favList: []
        }
    }

    componentDidMount() {
        this.LoadLocation();
    }

    LoadLocation() {

        const payload = {
            username: sessionStorage.getItem("username")
        };

        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/auser",
            method: "POST",
            data: payload
        })
        .then((r) => {
            let userFav = r.data[0].favouriteLocation;
            const locIdPayload = {
                loc_id: userFav
            }

            axios({
                url: "http://localhost:8080/locationbyid",
                method: "POST",
                data: locIdPayload
            })
            .then((r2) => {
                this.setState({
                    favList: r2.data
                });
            })
            .catch((err2) => {
                console.log("Internal server error");
            });

        })
        .catch((err) => {
            console.log("Internal server error");
        });
    }

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

                <table id="myTable" className="my-3">
                    <thead>
                        <tr className="header">
                            <th>Location</th>
                            <th>Event Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.favList.map((location, index) =>
                            <FavRow key={index} i={index} name={location.name} programme={location.programme} locid={location.locid} />)
                        }
                    </tbody>
                </table>
            </main>
        );
    }
}

class FavRow extends Component {

    render() {
        return (
            <tr>
                <td id={"loc" + this.props.i}>
                    <Link className="nav-link" to={`/dashboard/location/${this.props.locid}`}>{this.props.name}</Link>
                </td>
                <td>{this.props.programme.length}</td>
            </tr>
        );
    }
}
export default Favourite;