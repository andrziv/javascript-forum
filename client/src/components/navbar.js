import React from "react";
import {useContext} from "react";
import "bootstrap/dist/css/bootstrap.css";

import {NavLink} from "react-router-dom";
import LoginContext from "../context/login-context";

// function that creates buttons for the user to access various routes like signing in
// depends on if the user is logged in or not
const CheckNav = (props) => {
	const [isLoggedIn, setIsLoggedIn, username, setUsername] = useContext(LoginContext);
	if(isLoggedIn === true) { // buttons to display if the user is logged in
		return (
			<div className="btn-group">
				<NavLink id="navbarButton1" className="nav-link" to="/create">
					Create Post
				</NavLink>
				<NavLink id="navbarButton2" className="nav-link" to="/signout">
					Sign Out
				</NavLink>
				<div id="usernameIndicator">
					Logged in as: {username}
				</div>
			</div>
		);
	}
	else { // default case: buttons to display if the user is not logged in
		return (
			<div className="btn-group">
				<NavLink id="navbarButton1" className="nav-link" to="/signup">
					Sign Up
				</NavLink>
				<NavLink id="navbarButton2" className="nav-link" to="/login">
					Log In
				</NavLink>
			</div>
		);
	}
}

// displays the navbar
export default function Navbar() {
	return (
		<nav id="website-navbar" className="navbar navbar-light navbar-expand-md justify-content-md-left justify-content-start"> 
			<NavLink id="nav-logo" className="navbar-brand d-inline" to="/">
				<img style={{"width" : 20 + '%'}} src="https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png" alt=""></img>
			</NavLink>
			<div className="navbar-collapse collapse align-items-right w-100">
				<ul className="navbar-nav mx-auto text-md-right text-right">
					<li className="nav-item">
						<CheckNav/>
					</li>
				</ul>
			</div>
		</nav>
	);
}