import React, {useState} from "react";
import {useNavigate} from "react-router";

// handles the creation of accounts in the database as well as website ui
export default function SignUp() {
	const[form, setform] = useState({username:"", password:"", email:""});
	const navigate = useNavigate();

	const handlePost = (e) => {
		setform({...form, [e.target.name]: e.target.value});
	}

	// checks the user's inputted data:
	// if valid (ie username and email are new), creates a new account in the database
	// if not valid, returns and does nothing
	async function onSubmit(e) {
		e.preventDefault();

		const response = await fetch(`http://localhost:5000/account/`);
			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}
			const _user = await response.json();
			const usedUsernames = _user.filter((users) => (users.username === form.username));
			const usedEmails = _user.filter((users) => (users.email === form.email));

			if (usedUsernames.length !== 0) { // if there are accounts with the inputted username
				const message = "The inputted username is already in use.";
				window.alert(message);
				return;
			}
			else if (usedEmails.length !== 0) { // if there are emails with the inputted username
				const message = "The inputted email is already in use.";
				window.alert(message);
				return;
			}

			const createAccount = {username: form.username, password: form.password, email: form.email};

			await fetch(`http://localhost:5000/account/add`, {method: "POST", body: JSON.stringify(createAccount), headers: {'Content-Type': 'application/json'},});
			navigate("/");
	}

	return ( // returns the html code that the user sees on the account sign up page
		<div>
			<h3 className="post-banner">Create a New Account</h3>
			<form onSubmit={onSubmit} method="post" id="new-account-form">
				<div className="account-form-group">
					<label htmlFor="signupUsername">Create your Username</label>
					<input type="text" className="form-control" name="username" value={form.username} onChange={handlePost} id="signupUsername" placeholder="Username"/>
				</div>
				<div className="account-form-group">
					<label htmlFor="signupEmail">Enter your Email address</label>
					<input type="email" className="form-control" name="email" value={form.email} onChange={handlePost} id="signupEmail" placeholder="Email"/>
					<small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
				</div>
				<div className="account-form-group">
					<label htmlFor="signupPassword">Create your Password</label>
					<input type="password" className="form-control" name="password" value={form.password} onChange={handlePost} id="signupPassword" placeholder="Password"/>
				</div>
				<button type="submit" id="new-account-button" className="btn btn-primary">Create your Account</button>
			</form>
		</div>
	);
}