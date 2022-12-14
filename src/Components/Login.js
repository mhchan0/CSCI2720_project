import React, { Component } from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';

class Login extends Component {

    state = {
        username: "",
        password: ""
    }

    clearText = () => {
        this.setState({
            username: "",
            password: ""
        });

        const input_username = document.getElementById("login_username");
        if (input_username) {
            input_username.value = "";
        }

        const input_pwd = document.getElementById("login_pwd");
        if (input_pwd) {
            input_pwd.value = "";
        }
    }

    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    handlePwdChange = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    validateInput = (e) => {
        if (e.target.checkValidity()) {
            e.target.classList.remove("is-invalid");

            document.querySelector("#" + e.target.id + "-invalid").innerHTML = "";
        }
        else {
            e.target.classList.add("is-invalid");

            if (e.target.id === "login_username") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter username";
            }
            else if (e.target.id === "login_pwd") {
                document.querySelector("#" + e.target.id + "-invalid").innerText = "Please enter password";
            }
        }
    }

    handleClick = (e) => {
        let inputCorrect = true;

        // check username
        let element = document.querySelector("#login_username");
        if (this.state.username === "") {
            element.classList.add("is-invalid");
            document.querySelector("#login_username-invalid").innerText = "Please enter username";
            inputCorrect = false;
        }

        // check password
        element = document.querySelector("#login_pwd");
        if (this.state.password === "") {
            element.classList.add("is-invalid");
            document.querySelector("#login_pwd-invalid").innerText = "Please enter password";
            inputCorrect = false;
        }

        if (inputCorrect) {
            const payload = {
                username: this.state.username,
                password: this.state.password
            };

            axios({
                // need change localhost to the publicIP
                url: "http://localhost:8080/login",
                method: "POST",
                data: payload
            })
            .then((r) => {
                sessionStorage.setItem("username", r.data.username);
                sessionStorage.setItem("isAdmin", r.data.isAdmin);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    document.querySelector("#invalid-inputs").innerText = "Incorrect username or password";
                }
                else {
                    console.log("Internal server error");
                }
            });
        }
    }

    render() {
        return (
            <div id="login_page" className="container-fluid vh-100 d-flex justify-content-center">
                <div id="login_content" className="card shadow d-flex justify-content-center">
                    <div className="mx-5">
                        <div className="d-flex justify-content-around py-3">
                            <span className="login_switcher">LOG IN</span>
                            <Link to={"/signup"} style={{ textDecoration: 'none' }}>
                            <span className="login_switcher">SIGN UP</span>
                            </Link>
                        </div>

                        <h1 className="text-primary d-flex justify-content-center py-3">LOG IN</h1>

                        <div id="invalid-inputs" className="text-danger d-flex justify-content-center py-1"></div>

                        <div className="py-3 container">
                            <div className="d-flex">
                                <label htmlFor="login_username" className="h4">&#x1F464;</label>
                                <div className="w-100">
                                    <input type="text" placeholder="Username" className="form-control" id="login_username" onBlur={this.validateInput} onChange={this.handleUsernameChange} required/>
                                    <div id="login_username-invalid" className="text-danger"></div>
                                </div>
                            </div>
                            <br/>
                            <div className="d-flex">
                                <label htmlFor="login_username" className="h4">&#x1F512;</label>
                                <div className="w-100">
                                    <input type="password" placeholder="Password" className="form-control" id="login_pwd" onBlur={this.validateInput} onChange={this.handlePwdChange} required/>
                                    <div id="login_pwd-invalid" className="text-danger"></div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center py-3">
                            <button type="button" className="btn btn-primary" onClick={this.handleClick}>LOG IN</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;