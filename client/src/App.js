import React, {useState} from "react";

import {Route, Routes} from "react-router-dom";

// import all of the components that will be used in the app
import Navbar from "./components/navbar";
import {PostList, Post} from "./components/postlist";
import Edit from "./components/edit";
import Create from "./components/create";
import SignUp from "./components/signup";
import SignOut from "./components/signout";
import LogIn from "./components/login";

import {LoginProvider} from "./context/login-context";

// creates routes from the imported components for the app
// also creates a provider for the login context for other components to access the information 
// of whether or not the user is logged in, and their username
const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");

	return (
		<LoginProvider value={[isLoggedIn, setIsLoggedIn, username, setUsername]}>
			<div id="rootBackground">
				<Navbar/>
				<Routes>
					<Route exact path="/" element={<PostList />} />
					<Route path="/thread/:id" element={<Post/>} />
					<Route path="/edit/:id" element={<Edit />} />
					<Route path="/create" element={<Create />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/signout" element={<SignOut />} />
					<Route path="/login" element={<LogIn />} />
				</Routes>
			</div>
		</LoginProvider>
	);
};
	  
export default App;