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
 * Date        : xxx <fill in yourself>
 */
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventsList: [],
            locationList: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/events",
            method: "POST",
        })
        .then((e) => {
            this.setState({
                eventsList: e.data[0]
            });
            this.setState({
                locationList: e.data[1]
            });
            //console.log(e.data);
        })
        .catch((err) => console.log("Internal server error"));
    }

    showCreateInput = (e) => {
        document.querySelector("#create-event").style.display = "block";
    }

    hideCreateInput = (e) => {
        document.querySelector("#create_title").value = "";
        document.querySelector("#create_title").classList.remove("is-invalid");
        document.querySelector("#create_title-invalid").innerText = "";
        document.querySelector("#create_venue").value = "";
        document.querySelector("#create_venue").classList.remove("is-invalid");
        document.querySelector("#create_venue-invalid").innerText = "";
        document.querySelector("#create_date").value = "";
        document.querySelector("#create_date").classList.remove("is-invalid");
        document.querySelector("#create_date-invalid").innerText = "";
        document.querySelector("#create_desc").value = "";
        document.querySelector("#create_desc").classList.remove("is-invalid");
        document.querySelector("#create_desc-invalid").innerText = "";
        document.querySelector("#create_price").value = "";
        document.querySelector("#create_price").classList.remove("is-invalid");
        document.querySelector("#create_price-invalid").innerText = "";
        document.querySelector("#create_presenter").value = "";
        document.querySelector("#create_presenter").classList.remove("is-invalid");
        document.querySelector("#create_presenter-invalid").innerText = "";
        document.querySelector("#create-event").style.display = "none";
    }

    validateCreateInput = (e) => {
        if (e.target.checkValidity()) {
            if (String(e.target.value).length < 1 || String(e.target.value).length > 100) {
                if (e.target.id === "create_title") {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Title must be between 1 and 100 characters";
                }
                else if (e.target.id === "create_venue") {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Venue must be between 1 and 100 characters";
                }
                else if (e.target.id === "create_date") {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Date must be between 1 and 100 characters";
                }
                else if (e.target.id === "create_desc") {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Description must be between 1 and 100 characters";
                }
                else if (e.target.id === "create_price") {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Price must be between 1 and 100 characters";
                }
                else if (e.target.id === "create_presenter") {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Presenter must be between 1 and 100 characters";
                }
            }
            else {
                e.target.classList.remove("is-invalid");
                document.querySelector("#" + e.target.id + "-invalid").innerHTML = "";
            }
        }
        else {
            e.target.classList.add("is-invalid");

            if (e.target.id === "create_title") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter title";
            }
            else if (e.target.id === "create_venue") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter venue";
            }
            else if (e.target.id === "create_date") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter date";
            }
            else if (e.target.id === "create_desc") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter description";
            }
            else if (e.target.id === "create_price") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter price";
            }
            else if (e.target.id === "create_presenter") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter presenter";
            }
        }
    }

    createEvent = (e) => {
        let inputCorrect = true;
        let title = "";
        let venue = "";
        let date = "";
        let desc = "";
        let price = "";
        let presenter = "";

        // check title
        let elementTitle = document.querySelector("#create_title");
        title = elementTitle.value;
        if (title === "") {
            elementTitle.classList.add("is-invalid");
            document.querySelector("#create_title-invalid").innerText = "Please enter title";
            inputCorrect = false;
        }
        else if (String(title).length < 1 || String(title).length > 100) {
            elementTitle.classList.add("is-invalid");
            document.querySelector("#create_title-invalid").innerText = "Title must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check venue
        let elementVenue = document.querySelector("#create_venue");
        venue = elementVenue.value;
        if (venue === "") {
            elementVenue.classList.add("is-invalid");
            document.querySelector("#create_venue-invalid").innerText = "Please enter venue";
            inputCorrect = false;
        }
        else if (String(venue).length < 1 || String(venue).length > 100) {
            elementVenue.classList.add("is-invalid");
            document.querySelector("#create_venue-invalid").innerText = "Venue must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check date
        let elementDate = document.querySelector("#create_date");
        date = elementDate.value;
        if (date === "") {
            elementDate.classList.add("is-invalid");
            document.querySelector("#create_date-invalid").innerText = "Please enter date";
            inputCorrect = false;
        }
        else if (String(date).length < 1 || String(date).length > 100) {
            elementDate.classList.add("is-invalid");
            document.querySelector("#create_date-invalid").innerText = "Date must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check desc
        let elementDesc = document.querySelector("#create_desc");
        desc = elementDesc.value;
        if (desc === "") {
            elementDesc.classList.add("is-invalid");
            document.querySelector("#create_desc-invalid").innerText = "Please enter description";
            inputCorrect = false;
        }
        else if (String(desc).length < 1 || String(desc).length > 100) {
            elementDesc.classList.add("is-invalid");
            document.querySelector("#create_desc-invalid").innerText = "Description must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check price
        let elementPrice = document.querySelector("#create_price");
        price = elementPrice.value;
        if (price === "") {
            elementPrice.classList.add("is-invalid");
            document.querySelector("#create_price-invalid").innerText = "Please enter price";
            inputCorrect = false;
        }
        else if (String(price).length < 1 || String(price).length > 100) {
            elementPrice.classList.add("is-invalid");
            document.querySelector("#create_price-invalid").innerText = "Price must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check presenter
        let elementPresenter = document.querySelector("#create_presenter");
        presenter = elementPresenter.value;
        if (presenter === "") {
            elementPresenter.classList.add("is-invalid");
            document.querySelector("#create_presenter-invalid").innerText = "Please enter presenter";
            inputCorrect = false;
        }
        else if (String(presenter).length < 1 || String(presenter).length > 100) {
            elementPresenter.classList.add("is-invalid");
            document.querySelector("#create_presenter-invalid").innerText = "Presenter must be between 1 and 100 characters";
            inputCorrect = false;
        }

        if (inputCorrect) {
            const payload = {
                title: title,
                venue: venue,
                date: date,
                description: desc,
                price: price,
                presenter: presenter
            }

            axios({
                // need change localhost to the publicIP
                url: "http://localhost:8080/newevent",
                method: "POST",
                data: payload
            })
            .then(() => {
                this.hideCreateInput();
                this.loadData();
            })
            .catch((err) => {
                if (err.response.status === 406) {
                    //elementTitle.classList.add("is-invalid");
                    //document.querySelector("#create_title-invalid").innerText = "Username already exists";
                }
                else {
                    console.log("Internal server error");
                }
            });
        }
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
                        </span>
                        Event&nbsp;Data
                    </h2>
                    <h3 ><b className="text-primary">{username}</b>&nbsp;<i className="bi bi-person-circle"></i></h3>
                </div>
                <div>
                    <h1 className="my-3">Events&nbsp;Manage</h1>
                    <button type="button" className="btn btn-primary my-3" onClick={this.showCreateInput}>Create New Event</button>
                    <div id="create-event" className="border border-info w-50 rounded" style={{display: "none"}}>
                        <input type="text" placeholder="Title" className="form-control mx-3 mt-3 w-75" id="create_title" onBlur={this.validateCreateInput} required/>
                        <div id="create_title-invalid" className="text-danger mx-3"></div>
                        <br/>
                        <input type="text" placeholder="VenueID" className="form-control mx-3 w-75" id="create_venue" onBlur={this.validateCreateInput} required/>
                        <div id="create_venue-invalid" className="text-danger mx-3"></div>
                        <br/>
                        <input type="text" placeholder="Date" className="form-control mx-3 w-75" id="create_date" onBlur={this.validateCreateInput} required/>
                        <div id="create_date-invalid" className="text-danger mx-3"></div>
                        <br/>
                        <input type="text" placeholder="Description" className="form-control mx-3 w-75" id="create_desc" onBlur={this.validateCreateInput} required/>
                        <div id="create_desc-invalid" className="text-danger mx-3"></div>
                        <br/>
                        <input type="text" placeholder="Price" className="form-control mx-3 w-75" id="create_price" onBlur={this.validateCreateInput} required/>
                        <div id="create_price-invalid" className="text-danger mx-3"></div>
                        <br/>
                        <input type="text" placeholder="Presenter" className="form-control mx-3 w-75" id="create_presenter" onBlur={this.validateCreateInput} required/>
                        <div id="create_presenter-invalid" className="text-danger mx-3"></div>
                        <div className="m-3">
                            <button type="button" className="btn btn-primary" onClick={this.createEvent}>Create</button>
                            &nbsp;&nbsp;&nbsp;
                            <button type="button" className="btn btn-danger" onClick={this.hideCreateInput}>Cancel</button>
                        </div>
                    </div>

                    <h3 className="my-3">Events&nbsp;Table</h3>
                    <table className="table table-hover">
                        <thead>
                            <tr className="table-secondary">
                                <th>Event Details</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.eventsList.map((event, index) => <EventRow key={index} i={index} title={event.title} venue={event.venue} date={event.date}
                            desc={event.description} price={event.price} presenter={event.presenter} id={event._id} locname={this.state.locationList[index]} loadData={this.loadData}/>)}
                        </tbody>
                    </table>
                </div>
            </main>
        );
    }
}

class EventRow extends Component {

    deleteEvent = (e) => {
        const payload = {
            title: this.props.title,
            venue:this.props.venue,
            date: this.props.date,
            description: this.props.desc,
            price: this.props.price,
            presenter: this.props.presenter
        };

        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/deleteevent",
            method: "DELETE",
            data: payload
        })
        .then((e) => {
            this.props.loadData();
        })
        .catch((err) => console.log(err))
    }

    toggleEdit = (e) => {
        let element = document.querySelector("#update_title" + this.props.i);
        if (element.style.display === "none") {
            element.style.display = "block";
            document.querySelector("#update_venue" + this.props.i).style.display = "block";
            document.querySelector("#update_date" + this.props.i).style.display = "block";
            document.querySelector("#update_desc" + this.props.i).style.display = "block";
            document.querySelector("#update_price" + this.props.i).style.display = "block";
            document.querySelector("#update_presenter" + this.props.i).style.display = "block";
        }
        else {
            this.hideEdit();
        }
    }

    hideEdit = (e) => {
        let element = document.querySelector("#update_title" + this.props.i);
        element.value = "";
        element.style.display = "none";
        element.classList.remove("is-invalid");
        document.querySelector("#update_venue" + this.props.i).value = "";
        document.querySelector("#update_venue" + this.props.i).style.display = "none";
        document.querySelector("#update_venue" + this.props.i).classList.remove("is-invalid");
        document.querySelector("#update_date" + this.props.i).value = "";
        document.querySelector("#update_date" + this.props.i).style.display = "none";
        document.querySelector("#update_date" + this.props.i).classList.remove("is-invalid");
        document.querySelector("#update_desc" + this.props.i).value = "";
        document.querySelector("#update_desc" + this.props.i).style.display = "none";
        document.querySelector("#update_desc" + this.props.i).classList.remove("is-invalid");
        document.querySelector("#update_price" + this.props.i).value = "";
        document.querySelector("#update_price" + this.props.i).style.display = "none";
        document.querySelector("#update_price" + this.props.i).classList.remove("is-invalid");
        document.querySelector("#update_presenter" + this.props.i).value = "";
        document.querySelector("#update_presenter" + this.props.i).style.display = "none";
        document.querySelector("#update_presenter" + this.props.i).classList.remove("is-invalid");

        document.querySelector("#update_title" + this.props.i + "-invalid").innerText = "";
        document.querySelector("#update_venue" + this.props.i + "-invalid").innerText = "";
        document.querySelector("#update_date" + this.props.i + "-invalid").innerText = "";
        document.querySelector("#update_desc" + this.props.i + "-invalid").innerText = "";
        document.querySelector("#update_price" + this.props.i + "-invalid").innerText = "";
        document.querySelector("#update_presenter" + this.props.i + "-invalid").innerText = "";
    }

    validateUpdateInput = (e) => {
        if (e.target.checkValidity()) {
            if (String(e.target.value).length < 1 || String(e.target.value).length > 100) {
                if (e.target.id === "update_title" + this.props.i) {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Title must be between 1 and 100 characters";
                }
                else if (e.target.id === "update_venue" + this.props.i) {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Venue must be between 1 and 100 characters";
                }
                else if (e.target.id === "update_date" + this.props.i) {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Date must be between 1 and 100 characters";
                }
                else if (e.target.id === "update_desc" + this.props.i) {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Description must be between 1 and 100 characters";
                }
                else if (e.target.id === "update_price" + this.props.i) {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Price must be between 1 and 100 characters";
                }
                else if (e.target.id === "update_presenter" + this.props.i) {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Presenter must be between 1 and 100 characters";
                }
            }
            else {
                e.target.classList.remove("is-invalid");
                document.querySelector("#" + e.target.id + "-invalid").innerHTML = "";
            }
        }
        else {
            e.target.classList.add("is-invalid");

            if (e.target.id === "update_title"  + this.props.i) {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter title";
            }
            else if (e.target.id === "update_venue"  + this.props.i) {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter venue";
            }
            else if (e.target.id === "update_date"  + this.props.i) {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter date";
            }
            else if (e.target.id === "update_desc"  + this.props.i) {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter description";
            }
            else if (e.target.id === "update_price"  + this.props.i) {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter price";
            }
            else if (e.target.id === "update_presenter"  + this.props.i) {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter presenter";
            }
        }
    }

    updateEvent = (e) => {
        let inputCorrect = true;
        let title = "";
        let venue = "";
        let date = "";
        let desc = "";
        let price = "";
        let presenter = "";

        // check title
        let elementTitle = document.querySelector("#update_title" + this.props.i);
        if (elementTitle.style.display === "none") {
            return;
        }
        
        title = elementTitle.value;
        if (title === "") {
            elementTitle.classList.add("is-invalid");
            document.querySelector("#update_title" + this.props.i + "-invalid").innerText = "Please enter title";
            inputCorrect = false;
        }
        else if (String(title).length < 1 || String(title).length > 100) {
            elementTitle.classList.add("is-invalid");
            document.querySelector("#update_title" + this.props.i + "-invalid").innerText = "Title must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check venue
        let elementVenue = document.querySelector("#update_venue" + this.props.i);
        venue = elementVenue.value;
        if (venue === "") {
            elementVenue.classList.add("is-invalid");
            document.querySelector("#update_venue" + this.props.i + "-invalid").innerText = "Please enter venue";
            inputCorrect = false;
        }
        else if (String(venue).length < 1 || String(venue).length > 100) {
            elementVenue.classList.add("is-invalid");
            document.querySelector("#update_venue" + this.props.i + "-invalid").innerText = "Venue must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check date
        let elementDate = document.querySelector("#update_date" + this.props.i);
        date = elementDate.value;
        if (date === "") {
            elementDate.classList.add("is-invalid");
            document.querySelector("#update_date" + this.props.i + "-invalid").innerText = "Please enter date";
            inputCorrect = false;
        }
        else if (String(date).length < 1 || String(date).length > 100) {
            elementDate.classList.add("is-invalid");
            document.querySelector("#update_date" + this.props.i + "-invalid").innerText = "Date must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check desc
        let elementDesc = document.querySelector("#update_desc" + this.props.i);
        desc = elementDesc.value;
        if (desc === "") {
            elementDesc.classList.add("is-invalid");
            document.querySelector("#update_desc" + this.props.i + "-invalid").innerText = "Please enter description";
            inputCorrect = false;
        }
        else if (String(desc).length < 1 || String(desc).length > 100) {
            elementDesc.classList.add("is-invalid");
            document.querySelector("#update_desc" + this.props.i + "-invalid").innerText = "Description must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check price
        let elementPrice = document.querySelector("#update_price" + this.props.i);
        price = elementPrice.value;
        if (price === "") {
            elementPrice.classList.add("is-invalid");
            document.querySelector("#update_price" + this.props.i + "-invalid").innerText = "Please enter price";
            inputCorrect = false;
        }
        else if (String(price).length < 1 || String(price).length > 100) {
            elementPrice.classList.add("is-invalid");
            document.querySelector("#update_price" + this.props.i + "-invalid").innerText = "Price must be between 1 and 100 characters";
            inputCorrect = false;
        }

        // check presenter
        let elementPresenter = document.querySelector("#update_presenter" + this.props.i);
        presenter = elementPresenter.value;
        if (presenter === "") {
            elementPresenter.classList.add("is-invalid");
            document.querySelector("#update_presenter" + this.props.i + "-invalid").innerText = "Please enter presenter";
            inputCorrect = false;
        }
        else if (String(presenter).length < 1 || String(presenter).length > 100) {
            elementPresenter.classList.add("is-invalid");
            document.querySelector("#update_presenter" + this.props.i + "-invalid").innerText = "Presenter must be between 1 and 100 characters";
            inputCorrect = false;
        }



        
        if (inputCorrect) {
            const payload = {
                id: this.props.id,
                title: title,
                venue: venue,
                date: date,
                description: desc,
                price: price,
                presenter: presenter
            }

            axios({
                // need change localhost to the publicIP
                url: "http://localhost:8080/updateevent",
                method: "POST",
                data: payload
            })
            .then(() => {
                this.hideEdit();
                this.props.loadData();
            })
            .catch((err) => {
                if (err.response.status === 406) {
                    //elementUsername.classList.add("is-invalid");
                    //document.querySelector("#update_username" + this.props.i + "-invalid").innerText = "Username already exists";
                }
                else {
                    console.log("Internal server error");
                }
            });
        }
    }

    render() {
        return (
            <tr>
            <td className="col-md-10">
                <li className="list-group-item row-3">
                    <h6 className="text-break">Name:&nbsp;&nbsp;</h6>
                    <span className="text-break">{this.props.title}</span>
                    <input type="text" placeholder="Title" className="col form-control mt-3" id={"update_title" + this.props.i} style={{display: "none"}} onBlur={this.validateUpdateInput} required/>
                    <div id={"update_title"  + this.props.i + "-invalid"} className="text-danger"></div>
                    
                </li>
                <li className="list-group-item row-3">
                    <h6 className="text-break">Location ID:&nbsp;&nbsp;{"\n"}</h6>
                    <span className="text-break">{this.props.venue}</span>
                    <input type="text" placeholder="Venue" className="form-control mt-3" id={"update_venue" + this.props.i} style={{display: "none"}} onBlur={this.validateUpdateInput} required/>
                    <div id={"update_venue" + this.props.i + "-invalid"} className="text-danger"></div>
                </li>
                <li className="list-group-item row-3">
                    <h6 className="text-break">Location Name:&nbsp;&nbsp;{"\n"}</h6>
                    <span className="text-break">{this.props.locname}</span>
                </li>
                <li className="list-group-item row-3">
                    <h6 className="text-break">Date:&nbsp;&nbsp;{"\n"}</h6>
                    <span className="text-break">{this.props.date}</span>
                    <input type="text" placeholder="Date" className="form-control mt-3" id={"update_date" + this.props.i} style={{display: "none"}} onBlur={this.validateUpdateInput} required/>
                    <div id={"update_date" + this.props.i + "-invalid"} className="text-danger"></div>
                </li>
                <li className="list-group-item"><h6 className="text-break">Description:&nbsp;&nbsp;{"\n"}</h6>
                    <span className="text-break">{this.props.desc}</span>
                    <input type="text" placeholder="Description" className="form-control mt-3" id={"update_desc" + this.props.i} style={{display: "none"}} onBlur={this.validateUpdateInput} required/>
                    <div id={"update_desc" + this.props.i + "-invalid"} className="text-danger"></div>
                </li>
                <li className="list-group-item"><h6 className="text-break">Price:&nbsp;&nbsp;{"\n"}</h6>
                    <span className="text-break">{this.props.price}</span>
                    <input type="text" placeholder="Price" className="form-control mt-3" id={"update_price" + this.props.i} style={{display: "none"}} onBlur={this.validateUpdateInput} required/>
                    <div id={"update_price" + this.props.i + "-invalid"} className="text-danger"></div>
                </li>
                <li className="list-group-item"><h6 className="text-break">Presenter:&nbsp;&nbsp;{"\n"}</h6>
                    <span className="text-break">{this.props.presenter}</span>
                    <input type="text" placeholder="Presenter" className="form-control mt-3" id={"update_presenter" + this.props.i} style={{display: "none"}} onBlur={this.validateUpdateInput} required/>
                    <div id={"update_presenter" + this.props.i + "-invalid"} className="text-danger"></div>
                </li>
            </td>
            <td className="col-md-2">
                    <button type="button" className="btn btn-warning my-1 w-75" onClick={this.toggleEdit}>Edit Event</button>
                    <br/>
                    <button type="button" className="btn btn-success my-1 w-75" onClick={this.updateEvent}>Update Event</button>
                    <br/>
                    <button type="button" className="btn btn-danger my-1 w-75" onClick={this.deleteEvent}>Delete Event</button>
            </td>
            </tr>
        );
    }
}

export default Event;
