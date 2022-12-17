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
import React from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom";

import './App.css';

import Login from "./Components/Login.js";
import Signup from "./Components/Signup.js";
import Navbar from "./Components/Navbar.js";
import Location from "./Components/Location.js";
import Favourite from "./Components/Favourite.js";
import User from "./Components/User.js";
import Event from "./Components/Event.js";
import ALocation from "./Components/ALocation.js";
import FullNavbar from "./Components/FullNavbar.js";

function App() {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/location" element={<div><FullNavbar /><div className="container-fluid row"><Navbar /><Location /></div></div>} />
          <Route path="/dashboard/favourite" element={<div><FullNavbar /><div className="container-fluid row"><Navbar /><Favourite /></div></div>} />
          <Route path="/dashboard/user" element={<div><FullNavbar /><div className="container-fluid row"><Navbar /><User/></div></div>} />
          <Route path="/dashboard/event" element={<div><FullNavbar /><div className="container-fluid row"><Navbar /><Event /></div></div>} />
          <Route path="/dashboard/location/:loc" element={<div><FullNavbar /><div className="container-fluid row"><Navbar /><ALocation /></div></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
