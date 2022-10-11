import React, {useState, useContext} from "react";
import {useNavigate} from "react-router";
import LoginContext from "../context/login-context";

// handles the logging in of an existing account in the database as well as website ui
export default function LogIn() {
	const [isLoggedIn, setIsLoggedIn, username, setUsername] = useContext(LoginContext);
	const[form, setform] = useState({username:"", password:""});
	const navigate = useNavigate();

	const handlePost = (e) => {
		setform({...form, [e.target.name]: e.target.value});
	}

	// checks the user's inputted data:
	// if valid (ie username and password exist and match together in the database), 
	//             sets the login context to indicate that the user is logged in
	// if not valid, warns user and sends them back to the login page
	async function onSubmit(e) {
		e.preventDefault();
		const response = await fetch(`http://localhost:5000/account/`);
		if (!response.ok) {
			const message = `An error occurred: ${response.statusText}`;
			window.alert(message);
			return;
		}
		const _user = await response.json();
		const user = _user.filter((use) => ((use.password === form.password) && (use.username === form.username))); // gets the user from database with the matching password and username

		if (user.length === 0) {
			window.alert("No such account with entered username and email.");
			navigate("/login")
		}
		else {
			setIsLoggedIn(true);
			setUsername(form.username);
			navigate("/");
		}
	}

	return ( // returns the html code that the user sees on the account log in page
		<div>
			<h3 className="post-banner">Sign into your Account</h3>
			<form onSubmit={onSubmit} method="post" id="login-form">
				<div className="account-form-group">
					<label htmlFor="loginUsername">Enter your Account Username</label>
					<input type="text" className="form-control" name="username" value={form.username} onChange={handlePost} id="loginUsername" placeholder="Username"/>
				</div>
				<div className="account-form-group">
					<label htmlFor="loginPassword">Enter your Account Password</label>
					<input type="password" className="form-control" name="password" value={form.password} onChange={handlePost} id="loginPassword" placeholder="Password"/>
				</div>
				<div className="form-check">
					<input type="checkbox" className="form-check-input" id="rememberBox"/>
					<label className="form-check-label" htmlFor="rememberBox">Remember Me (7 days)</label>
				</div>
				<button type="submit" id="login-button" className="btn btn-primary">Sign in</button>
			</form>
		</div>
	);
}