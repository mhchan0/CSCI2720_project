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
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersList: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/users",
            method: "POST",
        })
        .then((e) => {
            this.setState({
                usersList: e.data
            });
        })
        .catch((err) => console.log("Internal server error"));
    }

    showCreateInput = (e) => {
        document.querySelector("#create-user").style.display = "block";
    }

    hideCreateInput = (e) => {
        document.querySelector("#create_username").value = "";
        document.querySelector("#create_username").classList.remove("is-invalid");
        document.querySelector("#create_username-invalid").innerText = "";
        document.querySelector("#create_pwd").value = "";
        document.querySelector("#create_pwd").classList.remove("is-invalid");
        document.querySelector("#create_pwd-invalid").innerText = "";
        document.querySelector("#create-user").style.display = "none";
    }

    validateCreateInput = (e) => {
        if (e.target.checkValidity()) {
            if (String(e.target.value).length < 4 || String(e.target.value).length > 20) {
                if (e.target.id === "create_username") {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Username must be between 4 and 20 characters";
                }
                else if (e.target.id === "create_pwd") {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Password must be between 4 and 20 characters";
                }
            }
            else {
                e.target.classList.remove("is-invalid");
                document.querySelector("#" + e.target.id + "-invalid").innerHTML = "";
            }
        }
        else {
            e.target.classList.add("is-invalid");

            if (e.target.id === "create_username") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter username";
            }
            else if (e.target.id === "create_pwd") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter password";
            }
        }
    }

    createUser = (e) => {
        let inputCorrect = true;
        let username = "";
        let password = "";

        // check username
        let elementUsername = document.querySelector("#create_username");
        username = elementUsername.value;
        if (username === "") {
            elementUsername.classList.add("is-invalid");
            document.querySelector("#create_username-invalid").innerText = "Please enter username";
            inputCorrect = false;
        }
        else if (String(username).length < 4 || String(username).length > 20) {
            elementUsername.classList.add("is-invalid");
            document.querySelector("#create_username-invalid").innerText = "Username must be between 4 and 20 characters";
            inputCorrect = false;
        }

        // check password
        let elementPwd = document.querySelector("#create_pwd");
        password = elementPwd.value;
        if (password === "") {
            elementPwd.classList.add("is-invalid");
            document.querySelector("#create_pwd-invalid").innerText = "Please enter password";
            inputCorrect = false;
        }
        else if (String(password).length < 4 || String(password).length > 20) {
            elementPwd.classList.add("is-invalid");
            document.querySelector("#create_pwd-invalid").innerText = "Password must be between 4 and 20 characters";
            inputCorrect = false;
        }

        if (inputCorrect) {
            const payload = {
                username: username,
                password: password
            }

            axios({
                // need change localhost to the publicIP
                url: "http://localhost:8080/newuser",
                method: "POST",
                data: payload
            })
            .then(() => {
                this.hideCreateInput();
                this.loadData();
            })
            .catch((err) => {
                if (err.response.status === 406) {
                    elementUsername.classList.add("is-invalid");
                    document.querySelector("#create_username-invalid").innerText = "Username already exists";
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
                    <h2 className="text-primary d-flex">
                        <span id="navbar-button">
                            <button type="button" className="btn btn-primary"><i className="bi bi-caret-right-fill" onClick={()=>this.expandNavbar()}></i></button>&nbsp;
                        </span>
                        User&nbsp;Data
                    </h2>
                    <h3 ><b className="text-primary">{username}</b>&nbsp;<i className="bi bi-person-circle"></i></h3>
                </div>
                <div>
                    <h1 className="my-3">Users&nbsp;Manage</h1>
                    <button type="button" className="btn btn-primary my-3" onClick={this.showCreateInput}>Create New User</button>

                    <div id="create-user" className="border border-info w-50 rounded" style={{display: "none"}}>
                        <input type="text" placeholder="Username" className="form-control mx-3 mt-3 w-75" id="create_username" onBlur={this.validateCreateInput} required/>
                        <div id="create_username-invalid" className="text-danger mx-3"></div>
                        <br/>
                        <input type="password" placeholder="Password" className="form-control mx-3 w-75" id="create_pwd" onBlur={this.validateCreateInput} required/>
                        <div id="create_pwd-invalid" className="text-danger mx-3"></div>
                        <div className="m-3">
                            <button type="button" className="btn btn-primary" onClick={this.createUser}>Create</button>
                            &nbsp;&nbsp;&nbsp;
                            <button type="button" className="btn btn-danger" onClick={this.hideCreateInput}>Cancel</button>
                        </div>
                    </div>

                    <h3 className="my-3">Users&nbsp;Table</h3>
                    <table className="table table-hover">
                        <thead>
                            <tr className="table-secondary">
                                <th>Username</th>
                                <th>Hashed&nbsp;Password</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.usersList.map((user, index) => <UserRow key={index} i={index} username={user.username} password={user.password} id={user._id} loadData={this.loadData}/>)}
                        </tbody>
                    </table>
                </div>
            </main>
        );
    }
}

class UserRow extends Component {

    deleteUser = (e) => {
        const payload = {
            username: this.props.username,
        };

        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/deleteuser",
            method: "DELETE",
            data: payload
        })
        .then((e) => {
            this.props.loadData();
        })
        .catch((err) => console.log(err))
    }

    toggleEdit = (e) => {
        let element = document.querySelector("#update_username" + this.props.i);
        if (element.style.display === "none") {
            element.style.display = "block";
            document.querySelector("#update_pwd" + this.props.i).style.display = "block";
        }
        else {
            this.hideEdit();
        }
    }

    hideEdit = (e) => {
        let element = document.querySelector("#update_username" + this.props.i);
        element.value = "";
        element.style.display = "none";
        element.classList.remove("is-invalid");
        document.querySelector("#update_pwd" + this.props.i).value = "";
        document.querySelector("#update_pwd" + this.props.i).style.display = "none";
        document.querySelector("#update_pwd" + this.props.i).classList.remove("is-invalid");
        document.querySelector("#update_username" + this.props.i + "-invalid").innerText = "";
        document.querySelector("#update_pwd" + this.props.i + "-invalid").innerText = "";
    }

    validateUpdateInput = (e) => {
        if (e.target.checkValidity()) {
            if (String(e.target.value).length < 4 || String(e.target.value).length > 20) {
                if (e.target.id === "update_username" + this.props.i) {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Username must be between 4 and 20 characters";
                }
                else if (e.target.id === "update_pwd" + this.props.i) {
                    document.querySelector("#" + e.target.id + "-invalid").innerText = "Password must be between 4 and 20 characters";
                }
            }
            else {
                e.target.classList.remove("is-invalid");
                document.querySelector("#" + e.target.id + "-invalid").innerHTML = "";
            }
        }
        else {
            e.target.classList.add("is-invalid");

            if (e.target.id === "update_username"  + this.props.i) {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter username";
            }
            else if (e.target.id === "update_pwd"  + this.props.i) {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter password";
            }
        }
    }

    updateUser = (e) => {
        let inputCorrect = true;
        let username = "";
        let password = "";

        // check username
        let elementUsername = document.querySelector("#update_username" + this.props.i);
        if (elementUsername.style.display === "none") {
            return;
        }
        
        username = elementUsername.value;
        if (username === "") {
            elementUsername.classList.add("is-invalid");
            document.querySelector("#update_username" + this.props.i + "-invalid").innerText = "Please enter username";
            inputCorrect = false;
        }
        else if (String(username).length < 4 || String(username).length > 20) {
            elementUsername.classList.add("is-invalid");
            document.querySelector("#update_username" + this.props.i + "-invalid").innerText = "Username must be between 4 and 20 characters";
            inputCorrect = false;
        }

        // check password
        let elementPwd = document.querySelector("#update_pwd" + this.props.i);
        password = elementPwd.value;
        if (password === "") {
            elementPwd.classList.add("is-invalid");
            document.querySelector("#update_pwd" + this.props.i + "-invalid").innerText = "Please enter password";
            inputCorrect = false;
        }
        else if (String(password).length < 4 || String(password).length > 20) {
            elementPwd.classList.add("is-invalid");
            document.querySelector("#update_pwd" + this.props.i + "-invalid").innerText = "Password must be between 4 and 20 characters";
            inputCorrect = false;
        }
        
        if (inputCorrect) {
            const payload = {
                id: this.props.id,
                username: username,
                password: password
            }

            axios({
                // need change localhost to the publicIP
                url: "http://localhost:8080/updateuser",
                method: "POST",
                data: payload
            })
            .then(() => {
                this.hideEdit();
                this.props.loadData();
            })
            .catch((err) => {
                if (err.response.status === 406) {
                    elementUsername.classList.add("is-invalid");
                    document.querySelector("#update_username" + this.props.i + "-invalid").innerText = "Username already exists";
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
                <td>
                    {this.props.username}
                    <input type="text" placeholder="Username" className="form-control mt-3" id={"update_username" + this.props.i} style={{display: "none"}} onBlur={this.validateUpdateInput} required/>
                    <div id={"update_username"  + this.props.i + "-invalid"} className="text-danger"></div>
                </td>
                <td>
                    <span className="text-break">{this.props.password}</span>
                    <input type="text" placeholder="Password" className="form-control mt-3" id={"update_pwd" + this.props.i} style={{display: "none"}} onBlur={this.validateUpdateInput} required/>
                    <div id={"update_pwd" + this.props.i + "-invalid"} className="text-danger"></div>
                </td>
                <td>
                    <button type="button" className="btn btn-warning my-1" onClick={this.toggleEdit}>Edit User</button>
                    &nbsp;&nbsp;
                    <button type="button" className="btn btn-success my-1" onClick={this.updateUser}>Update User</button>
                    <br/>
                    <button type="button" className="btn btn-danger my-1" onClick={this.deleteUser}>Delete User</button>
                </td>
            </tr>
        );
    }
}

export default User;
