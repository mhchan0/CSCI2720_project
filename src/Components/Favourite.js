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

    expandNavbar = () => {
        document.querySelector("#navbar-full").style.display = "block";
    }

    render() {

        let username = sessionStorage.getItem("username");
        if (username === null) {
			window.location.replace("http://localhost:3000/");
		}

        return (
			<main className="col">
                <div className="my-3 d-flex justify-content-between">
                    <h2 className="text-primary">
                        <span id="navbar-button">
                            <button type="button" className="btn btn-primary"><i className="bi bi-caret-right-fill" onClick={()=>this.expandNavbar()}></i></button>&nbsp;
                        </span>Favourite
                    </h2>
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
