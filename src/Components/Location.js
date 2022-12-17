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
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Map from "./Map.js"

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationList: [],
            search: "",
            sortAscending: false,
            favList: []
        }
    }

    componentDidMount() { //load for each set state(just want once=> new class + new componentdidmount)
        this.LoadLocationList();
    }


    searchLocation() { //search keyword
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
  
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[0];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
    }

    sortTable() { //sort table according no. of event
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("myTable");
        switching = true;
          
        // Make a loop that will continue until no switching has been done://
        while (switching) {
          //start by saying: no switching is done:
          switching = false;
          rows = table.rows;
          
          // Loop through all table rows (except the first, which contains table headers)://
          for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            
            //Get the two elements you want to compare, one from current row and one from the next://
            x = rows[i].getElementsByTagName("TD")[1];
            y = rows[i + 1].getElementsByTagName("TD")[1];
            
            //check if the two rows should switch place:
            if (this.state.sortAscending) {
                if (Number(x.innerHTML) > Number(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                break;
                }
            }
            else {
                if (Number(x.innerHTML) < Number(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                break;
                }
            }
          }
          if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
          }
        }
        
        if (this.state.sortAscending) {
            document.querySelector("#sort-btn").innerHTML = 'Sort <i class="bi bi-arrow-up"></i>';
            this.setState({
                sortAscending: false
            });
        }
        else {
            document.querySelector("#sort-btn").innerHTML = 'Sort <i class="bi bi-arrow-down"></i>';
            this.setState({
                sortAscending: true
            });
        }
    }

    LoadLocationList() {

        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/location",
            method: "POST",
        })
        .then((r) => {
            this.setState({
                locationList: r.data
            });
        })
        .catch((err) => {
            console.log("Internal server error");
        });

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
            this.setState({
                favList: r.data[0].favouriteLocation
            });
        })
        .catch((err) => {
            console.log(err);
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
        let lastmod = sessionStorage.getItem("lastModified");

        return ( //i add something behind, u may delete sth when it is overlapped
			<main className="col">
                <div className="my-3 d-flex justify-content-between">
                    <h2 className="text-primary d-flex">
                        <span id="navbar-button">
                            <button type="button" className="btn btn-primary"><i className="bi bi-caret-right-fill" onClick={()=>this.expandNavbar()}></i></button>&nbsp;
                        </span>
                            Location
                    </h2>
                    <h3 ><b className="text-primary">{username}</b>&nbsp;<i className="bi bi-person-circle"></i></h3>
                </div>

                <Map lng={114.177216} lat={22.302711} zoom={10}/>
                
                <input type="text" id="myInput" value={this.state.search} onChange={(value) => this.setState({search: value.target.value})} onKeyUp={() => this.searchLocation()} placeholder="Search for Locations..." />
                
                <p className="d-inline"><button id="sort-btn" className="btn btn-info" onClick={() => this.sortTable()}>Sort <i className="bi bi-arrow-up"></i></button></p>
                <h5 className="d-inline float-end">Last Updated: {lastmod}</h5>
                <table id="myTable" className="my-3">
                    <thead>
                        <tr className="header">
                            <th>Location</th>
                            <th>Event Number</th>
                            <th>Favourite Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.locationList.map((location, index) =>
                        <LocationRow key={index} i={index} name={location.name} programme={location.programme} locid={location.locid} loc_id={location._id} favList={this.state.favList} />)
                        }
                    </tbody>
                </table>
            </main>
            
        );
    }
}

class LocationRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFavourite: this.props.favList.includes(this.props.loc_id)
        };
    }

    clickStar = () => {
        if (!this.state.isFavourite) {
            this.setState({
                isFavourite: true
            });
        }
        else {
            this.setState({
                isFavourite: false
            });
        }

        const payload = {
            username: sessionStorage.getItem("username"),
            locid: this.props.locid,
            fav: !this.state.isFavourite
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

    render() {
        return (
            <tr>
                <td id={"loc" + this.props.i}>
                    <Link className="nav-link" to={`/dashboard/location/${this.props.locid}`}>{this.props.name}</Link>
                </td>
                <td>{this.props.programme.length}</td>
                <td>
                    {!this.state.isFavourite && <i id={"star" + this.props.i} className="bi bi-star-fill text-secondary click-star" onClick={() => this.clickStar()}></i>}
                    {this.state.isFavourite && <i id={"star" + this.props.i} className="bi bi-star-fill text-warning click-star" onClick={() => this.clickStar()}></i>}
                </td>
            </tr>
        );
    }
}

export default Location;
