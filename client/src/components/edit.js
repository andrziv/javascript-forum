import React, {useState, useEffect, useContext} from "react";
import {useParams, useNavigate} from "react-router";
import axios from "axios";
import LoginContext from "../context/login-context";

// handles the editing of old post threads in the database as well as website ui
export default function Edit() {
	const [form, setForm] = useState({name:"", subject:"", post:"", posts: [],});
	const params = useParams();
	const navigate = useNavigate();

	const [isLoggedIn, setIsLoggedIn, username, setUsername] = useContext(LoginContext);
	let prevImage = "";

	// gets the post specified by the user to edit from the database
	useEffect(()=>{
		async function fetchData() {
			const id = params.id.toString();
			const response = await fetch(`http://localhost:5000/post/${id}`); 
			if (!response.ok) {
				const message = `An error has occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			const post = await response.json();
			if (!post) {
				window.alert(`Post with id ${id} not found`);
				navigate("/");
				return;
			}
			prevImage = post.image;
			setForm(post);
		}

		fetchData();
		return;
	}, [params.id, navigate]);

	function updateForm(value) {
		return setForm((prev)=>{
			return {...prev, ...value};
		});
	}

	// updates the post with the new information
	async function onSubmit(e) {
		e.preventDefault();

		if (prevImage === form.image) { // if the image isnt different or there is no image, use alternative database post route
			const editedPost = {name: form.name, subject: form.subject, post: form.post,};
			await fetch(`http://localhost:5000/update/${params.id}`, {method: "POST", body: JSON.stringify(editedPost), headers: {'Content-Type': 'application/json'},});
		}
		else { // if there is a new image, use axios to update the post object in the database
			const formData = new FormData(document.getElementById("post-form"));
			axios.post(`http://localhost:5000/update-with-image/${params.id}`, formData).then(
				(res)=>{
					// console.log(res);
				}).catch((err)=>{
				window.alert(err);
				return;
			});
		}

		navigate("/");
	}

	return ( // returns the html code that the user sees on the edit post page
		<div>
			<h3 className="post-banner">Update your Post</h3>
			<form onSubmit={onSubmit} encType="multipart/Form-data" method="post" id="post-form">
				<div className="newpost-form-group">
					<label htmlFor="staticUsername">Your Username</label>
					<input type="text" readOnly className="form-control-plaintext" name="name" value={username} onChange={(e) => updateForm({ name: e.target.value })} id="createpost-staticUsername"/>
				</div>
				<div className="newpost-form-group">
					<label htmlFor="postTitle">Edit the Post Title</label>
					<input type="text" className="form-control" name="subject" value={form.subject} onChange={(e) => updateForm({ subject: e.target.value })} id="createpost-title" required={true}/>
				</div>
				<div className="newpost-form-group">
					<label htmlFor="postBody">Edit the Post Body</label>
					<textarea type="text" className="form-control" name="post" value={form.post} onChange={(e) => updateForm({ post: e.target.value })} id="createpost-body" required={true}></textarea>
				</div>
				<div className="newpost-form-group">
					<label className="custom-file-label" htmlFor="postImage">Choose file (optional)</label>
					<div className="custom-file">
						<input type="file" accept=".jpg, .jpeg, .png" name="image" onChange={(e) => updateForm({ image: e.target.value })} className="custom-file-input" id="create-post-image"/>
					</div>
				</div>
				<input type="submit" value="Update the Post" id="edit-post-button" className="btn btn-primary"/>
			</form>
		</div>
	);
}