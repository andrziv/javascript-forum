import React, {useState, useContext} from "react";
import {useNavigate} from "react-router";
import LoginContext from "../context/login-context";

// changes the login context variables to indicate that the user is no longer logged in
export default function SignOut() {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn, username, setUsername] = useContext(LoginContext);
	
	setUsername(null);
	setIsLoggedIn(false);
	navigate("/");
}