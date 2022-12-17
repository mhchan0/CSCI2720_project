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
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';

class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
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

                //download xml & update db
                axios({
                    // need change localhost to the publicIP
                    url: "http://localhost:8080/getXML",
                    method: "post"
                })
                .then((r) => {
                    let currentTime = new Date();
                    let date = ("0" + currentTime.getDate()).slice(-2);
                    let month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
                    let year = currentTime.getFullYear();
                    let hour = (currentTime.getHours()<10) ? '0' + currentTime.getHours() : currentTime.getHours();
                    let minute = (currentTime.getMinutes()<10) ? '0' + currentTime.getMinutes() : currentTime.getMinutes();
                    let second = (currentTime.getSeconds()<10) ? '0' + currentTime.getSeconds() : currentTime.getSeconds();
                    let timeString = "" + year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second + "";
                    sessionStorage.setItem("lastModified", timeString);
                    window.location.replace("http://localhost:3000/dashboard/location");
                })
                .catch((err) => {
                    if (err.response.status === 406) {
                        
                    }
                    else {
                        console.log("Internal server error");
                    }
                });
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
