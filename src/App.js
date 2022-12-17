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
