import React, {useEffect, useState, useContext} from "react";
import {Link} from "react-router-dom";
import LoginContext from "../context/login-context";

// Deals with the posts in the home page list, handling the function of the buttons and the way it is presented to the user
const LPost = (props) => {
	const [isLoggedIn, setIsLoggedIn, username, setUsername] = useContext(LoginContext);
	
	// below is for the preview of a post's paragraph (what is shown on the homepage posts list)
	let postParagraphPreview = "";
	if(props.post.post.length >= 50)
	{
		postParagraphPreview = "> " + props.post.post.substring(0, 50) + "...";
	}
	else if (props.post.post.length > 0){
		postParagraphPreview = "> " + props.post.post;
	}

	// below determines what the user sees on the homepage posts list
	if (isLoggedIn === true) { // if the user is logged in...
		if (props.post.name === username) { // if the logged in user is the owner of the post
			return (
				<div className="listPostAuthored">
					<Link style={{textDecoration: 'none'}} to={`/thread/${props.post._id}`}>
						<div id="lpAuthTextDetails">
							<h6>Created by {props.post.name}</h6>
							<h2>{props.post.subject}</h2>
							<h6 id="lpParagraph">{postParagraphPreview}</h6>
						</div>
					</Link>
					<Link id="listPostEditButton" className="btn btn-outline-primary" to={`/edit/${props.post._id}`}>Edit</Link>
					<button id="listPostDeleteButton" className="btn btn-outline-primary"
						onClick={() => {
							props.deletePost(props.post._id);
						}}>
						Delete
					</button>
				</div>
			);
		}
		else { // if the logged in user isnt the owner of the post
			return (
				<Link style={{textDecoration: 'none'}} to={`/thread/${props.post._id}`}>
					<div className="listPost">
						<h6>Created by {props.post.name}</h6>
						<h2>{props.post.subject}</h2>
						<h6 id="lpParagraph">{postParagraphPreview}</h6>
					</div>
				</Link>
			);
		}
	}
	else { // if the user isnt logged in
		return (
			<Link style={{textDecoration: 'none'}} to={`/thread/${props.post._id}`}>
				<div className="listPost">
					<h6>Created by {props.post.name}</h6>
					<h2>{props.post.subject}</h2>
					<h6 id="lpParagraph">{postParagraphPreview}</h6>
				</div>
			</Link>
		);
	}
};

// deals with the Comments under the posts in the specific post threads, handling the way they are designed
const LComment = (props)=>{
	if (props.comment.name === "" || props.comment.name == null) {
		return (
		<div className="postComment">
			<h4>[Deleted]</h4>
			<p>{props.comment.comment}</p>
		</div> )
	}
	else {
		return (
		<div className="postComment">
			<h4>{props.comment.name}</h4>
			<p>{props.comment.comment}</p>
		</div> )
	}
};

// Gets the object ID of the current post from the URL
function getID() {
	return window.location.pathname.split("/")[2];
}

// Gets the post object with the specific given ID
function GetPost(id) {
	const [Post, setPost] = useState([]);
	useEffect(()=>{async function get() {
		const response = await fetch(`http://localhost:5000/post/${id}`);
		if (!response.ok) {
			const message = `An error occurred: ${response.statusText}`;
			window.alert(message);
			return;
		}
		const _post = await response.json();
		setPost(_post);
	} get();
	return;}, [id, Post.length]
	);
	return Post;
}

// Gets the comment object with the specific given ID
function GetComment(id) {
	const [Comment, setComment] = useState([]);
	useEffect(()=>{async function get() {
		const response = await fetch(`http://localhost:5000/post/${id}/comments`);
		if (!response.ok) {
			const message = `An error occurred: ${response.statusText}`;
			window.alert(message);
			return;
		}
		const _comment = await response.json();
		setComment(_comment);
	} 
		get();
		return;
	}, [id, Comment.length]
	);
	return Comment;
}

// post function is for the fetching, displaying of the specific post thread that the user opened
// includes the display of the comment chains of that post thread and the opportunity to post a comment if
// the user is logged in
export function Post() {
	const id = getID();
	const post = GetPost(id);
	const comments = GetComment(id);

	const[form, setform] = useState({name:"", comment:""});

	const [isLoggedIn, setIsLoggedIn, username, setUsername] = useContext(LoginContext);

	// if the user is logged in and submits a valid comment, upload to db
	async function onSubmit (e) {
		e.preventDefault();
		if (form.comment === "") {
			return;
		}
		const newComment = {name: username, comment: form.comment};
		await fetch(`http://localhost:5000/post/${id}/add-comment`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(newComment)}).catch(error=>{window.alert(error); return;})
		setform({name:"", comment:""});
		if (window.confirm("Comment Posted " + e.target.name)) {
			window.location.reload();
		}
	}

	// gets all of the comments tied to the specific post thread
	function commentList() {
		return comments.filter((comment)=>(comment.postid===id)).map((comment)=>(<LComment comment={comment} key={comment._id}/>));
	}

	function updateForm(value) {
		return setform((prev)=>{return {...prev,...value}});
	}

	// if there is a picture in the post, return the picture from the db
	// else return empty string
	function displayPicture() {
		if (post.image == null || post.image === "")
		{
			return "";
		}

		return `http://localhost:5000/${post.image}`;
	}

	// below is what the user sees on the page depending on if they are logged in or not
	if (isLoggedIn === true) { // if user is logged in
		return (
			<div className="threadPost">
				<h1 className="display-4">{post.subject}</h1>
				<p className="lead">Created by {post.name}</p>
				<hr className="my-4"/>
				<p>{post.post}</p>
				<img className="threadPostPicture" src={displayPicture()} alt=""/>
				<hr className="my-4"/>
				<form className="input-group" onSubmit={onSubmit}>
					<input type="text" id="commentTextbox" className="form-control" placeholder="Post a comment..." value={form.comment} onChange={(e)=>updateForm({comment:e.target.value})}/>
					<div className="input-group-append">
						<input id="commentSubmit" className="btn btn-outline-secondary" type="submit"/>
					</div>
				</form>
				<div>{commentList()}</div>
			</div>);
	}
	return ( // default case where user is not logged in 
		<div className="threadPost">
			<h1 className="display-4">{post.subject}</h1>
			<p className="lead">Created by {post.name}</p>
			<hr className="my-4"/>
			<p>{post.post}</p>
			<img className="threadPostPicture" src={displayPicture()} alt=""/>
			<hr className="my-4"/>
			<div>{commentList()}</div>
		</div>);
}

// post list function handles the homepage of the website with all of the listed post threads
export function PostList() {
	const [posts, setPosts] = useState([]);

	// gets the posts from the database
	useEffect(()=> {
		async function getPosts() {
			const response = await fetch('http://localhost:5000/post/');
			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			const posts = await response.json();
			setPosts(posts);
		}

		getPosts();
		return;
	}, [posts.length]);

	// deletes the post with the specified object id
	async function deletePost(id) {
		await fetch(`http://localhost:5000/${id}`, {method: "DELETE"});

		const newPosts = posts.filter((el)=>el._id !== id);
		setPosts(newPosts);
	}

	// creates the listed posts on the homepage
	function postList() {
		return posts.map((post) => {return (
			<LPost
				post={post}
				deletePost={() => deletePost(post._id)}
				key={post._id}/>
		);});
	}

	// displays the posts from postlist
	return (
		<div className="postListBG">
		  {postList()}
		</div>
	);
}