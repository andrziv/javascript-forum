import React, {useState, useContext} from "react";
import {useNavigate} from "react-router";
import axios from "axios";
import LoginContext from "../context/login-context";

// handles the creation of new post threads in the database as well as website ui
export default function Create() {
	const[form, setform] = useState({name:"", subject:"", post:"", image:""});
	const navigate = useNavigate();

	const [isLoggedIn, setIsLoggedIn, username, setUsername] = useContext(LoginContext);

	// if user is not logged in, send them to the homepage
	function checkLogged(){
		if(!isLoggedIn){
			window.alert("You are not logged in.");
			navigate("/");
		}
	}

	const handlePost = (e) => {
		setform({...form, [e.target.name]: e.target.value});
	}

	const handleImage = (e) => {
		setform({...form, image: e.target.files[0]});
	}

	// if the new post is correctly made, upload to the database
	const onSubmit = (e) => {
		e.preventDefault();
		checkLogged(); // if user is not logged in, send them to the homepage
		
		if (form.image === "" || form.image === null) { // if there is no image, use alternate method
			onSubmitNoImage(e);
		}
		else { // if there is an image, use axios to upload to the database
			const formData = new FormData(document.getElementById("post-form"));
			axios.post("http://localhost:5000/post/add-with-image", formData).then(
				(res)=>{
					// console.log(res);
				}).catch((err)=>{
					window.alert(err);
					return;
				});
		}

		setform({name:"", subject:"", post:""});
		navigate("/");
	}

	// if the new post has no image, use this upload method to the database instead
	async function onSubmitNoImage(e) {
		e.preventDefault();
		const createPost = {name: username, subject: form.subject, post: form.post, image:""};
		await fetch(`http://localhost:5000/post/add`, {method: "POST", body: JSON.stringify(createPost), headers: {'Content-Type': 'application/json'},});
	}

	return ( // returns the html code that the user sees on the create post page
		<div>
            <h3 className="post-banner">Create a New Post</h3>
            <form onSubmit={onSubmit} encType="multipart/Form-data" method="post" id="post-form">
				<div className="newpost-form-group">
                    <label htmlFor="staticUsername">Your Username</label>
                    <input type="text" readOnly className="form-control-plaintext" name="name" value={username} onChange={handlePost} id="createpost-staticUsername"/>
                </div>
                <div className="newpost-form-group">
                    <label htmlFor="postTitle">Create the Post Title</label>
                    <input type="text" className="form-control" name="subject" value={form.subject} onChange={handlePost} id="createpost-title" required={true}/>
                </div>
                <div className="newpost-form-group">
                    <label htmlFor="postBody">Create the Post Body</label>
                    <textarea type="text" className="form-control" name="post" value={form.post} onChange={handlePost} id="createpost-body" required={true}></textarea>
                </div>
				<div className="newpost-form-group">
					<label className="custom-file-label" htmlFor="postImage">Choose file (optional)</label>
					<div className="custom-file">
						<input type="file" accept=".jpg, .jpeg, .png" name="image" onChange={handleImage} className="custom-file-input" id="create-post-image"/>
					</div>
				</div>
                <input type="submit" value="Create the Post" id="create-post-button" className="btn btn-primary"/>
            </form>
        </div>
	);
}