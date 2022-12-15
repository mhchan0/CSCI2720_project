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
            search: ""
        }
    }

    // componentDidMount() {//load for each set state(just want once=> new class + new componentdidmount)

    // }


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
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              //if so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          }
          if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
          }
        }     
    }

    Load() {

        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/location/loc1",
            method: "GET",
        })
        .then((r) => {
            window.location.replace("http://localhost:3000/dashboard/location/loc1");
            console.log(r);
        })
    }

    render() {

        let username = sessionStorage.getItem("username");
        if (username === null) {
			window.location.replace("http://localhost:3000/");
		}

        return ( //i add something behind, u may delete sth when it is overlapped
			<main className="col">
                <div className="my-3 d-flex justify-content-between">
                    <h2 className="text-primary">Location</h2>
                    <h3 ><b className="text-primary">{username}</b>&nbsp;<i className="bi bi-person-circle"></i></h3>
                </div>

                <Map lng={114.177216} lat={22.302711} zoom={10}/>
                
                <input type="text" id="myInput" value={this.state.search} onChange={(value) => this.setState({search: value.target.value})} onKeyUp={() => this.searchLocation()} placeholder="Search for Locations.." />
                
                <p><button onClick={() => this.sortTable()}>Sort</button></p>
                
                <table id="myTable">
                <tr className="header">
                    <th>Location</th>
                    <th>Event</th>
                    <th>Favourite Location</th>
                </tr>
                <tr onClick={() => this.Load()} >
                    <Link className="nav-link" to={"/dashboard/location/loc1"}><td id="loc1">Sha Tin Town Hall (Auditorium)</td></Link>
                    <td>3</td>
                    <td>
                    <div className="rate">
                        <input type="checkbox" id="star1" name="rate" value="1" />
                        <label htmlFor="star1" title="text">1 star</label>
                    </div>
                    </td>
                </tr>
                <tr id="loc2" onClick= "Load()">
                    <td>loc2</td>
                    <td>10</td>
                    <td>
                    <div className="rate">
                        <input type="checkbox" id="star2" name="rate" value="2" />
                        <label htmlFor="star2" title="text">1 star</label>
                    </div>
                    </td>
                </tr>
                <tr id="loc3" onClick= "Load()">
                    <td>loc3</td>
                    <td>20</td>
                    <td>
                    <div className="rate">
                        <input type="checkbox" id="star3" name="rate" value="3" />
                        <label htmlFor="star3" title="text">1 star</label>
                    </div>
                    </td>
                </tr>
                <tr id="loc4" onClick= "Load()">
                    <td>loc4</td>
                    <td>15</td>
                    <td>
                    <div className="rate">
                        <input type="checkbox" id="star4" name="rate" value="4" />
                        <label htmlFor="star4" title="text">1 star</label>
                    </div>
                    </td>
                </tr>
                </table>
            </main>
            
        );
    }
}

export default Location;
