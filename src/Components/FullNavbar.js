import React, { Component } from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

class FullNavbar extends Component {

	Logout = (e) => {
		sessionStorage.clear();
		window.location.replace("http://localhost:3000/");
	}

    hideNavbar = () => {
        document.querySelector("#navbar-full").style.display = "none";
    }

    render() {

		let isAdmin = sessionStorage.getItem("isAdmin");
		if (isAdmin === null) {
			window.location.replace("http://localhost:3000/");
		}

        return (
		    	<nav id="navbar-full" className="navbar navbar-dark bg-primary vh-100 vw-100 sticky-top">
		    		<ul className="navbar-nav">
                        <div className="m-3">
                            <button type="button" className="btn btn-secondary" onClick={this.hideNavbar}><i className="bi bi-caret-left-fill"></i></button>
  						</div>
						<div className="navbar-brand my-3 text-center">
							<h3>CSCI2720</h3>
  						</div>
						<div className="px-4">
		    				<li className="navbar-item my-3">
		    					<Link className="nav-link" to={"/dashboard/location"} onClick={this.hideNavbar}><h5><i className="bi bi-map-fill"></i>&nbsp;Location</h5></Link>
		    				</li>
		    				<li className="navbar-item my-3">
		    					<Link className="nav-link" to={"/dashboard/favourite"} onClick={this.hideNavbar}><h5><i className="bi bi-heart-fill"></i>&nbsp;Favourite</h5></Link>
		    				</li>
							{isAdmin === "true" &&
							<div>
							<li className="navbar-item my-3">
		    					<Link className="nav-link" to={"/dashboard/user"} onClick={this.hideNavbar}><h5><i className="bi bi-people-fill"></i>&nbsp;User Data</h5></Link>
		    				</li>
							<li className="navbar-item my-3">
		    					<Link className="nav-link" to={"/dashboard/event"} onClick={this.hideNavbar}><h5><i className="bi bi-camera-reels-fill"></i>&nbsp;Event Data</h5></Link>
		    				</li>
							</div>
							}
						</div>
		    		</ul>
					<div className="text-center w-100">
							<button type="button" className="btn btn-secondary" onClick={this.Logout}>LOG OUT</button>
					</div>
		    	</nav>
			
        );
    }
}

export default FullNavbar;