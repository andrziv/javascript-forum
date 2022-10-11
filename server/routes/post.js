const express = require("express");
const postRoutes = express.Router();
const dbo = require("../db/conn");
const objectId = require("mongodb").ObjectId;
const multer = require("multer");
const {v4:uuidv4} = require("uuid");
const path = require("path");
const storage = multer.diskStorage({
	destination:(req, file, cb)=>{
		cb(null, "images")}, 
		filename:(req, file, cb)=>{
			cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname))}
		});

const fileFilter = (req, file, cb) =>  {
	const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
	cb(null, allowedTypes.includes(file.mimetype));
}

let upload = multer({storage, fileFilter});

// gets all of the post objects from the database
postRoutes.route("/post").get((req, res)=>{
	let db_connect = dbo.getDB("forum");
	db_connect.collection("posts").find({}).toArray((err, result)=>{
		if (err) {
			throw err;
		}
		res.json(result);
	})
});

// gets the post object with the specific object id from the database
postRoutes.route("/post/:id").get((req, res)=>{
	let db_connect = dbo.getDB();
	let myQuery = {_id:objectId(req.params.id)}
	db_connect.collection("posts").findOne(myQuery, (err, result)=>{
		if (err) {
			throw err;
		}
		res.json(result);
	})
});

// gets all of the comment objects from a specific post from the database
postRoutes.route("/post/:id/comments").get((req, res)=>{
	let db_connect = dbo.getDB();
	db_connect.collection("comments").find({}).toArray((err, result)=>{
		if (err) {
			throw err;
		}
		res.json(result);
	})
});

// adds a comment to the database for a specific post
postRoutes.route("/post/:id/add-comment").post((req, response)=>{
	let db_connect = dbo.getDB();
	let myObject = {postid:objectId(req.params.id), name:req.body.name, comment:req.body.comment}
	db_connect.collection("comments").insertOne(myObject, (err, res)=>{
		if (err) {
			throw err;
		}
		response.json(res);
	})
});

// adds a post to the database (no image)
postRoutes.route("/post/add").post((req, response)=>{
	let db_connect = dbo.getDB();
	let myObject = {name:req.body.name, subject:req.body.subject, post:req.body.post, image: ""}
	db_connect.collection("posts").insertOne(myObject, (err, res)=>{
		if (err) {
			throw err;
		}
		response.json(res);
	})
});

// adds a post to the database (with image)
postRoutes.route("/post/add-with-image").post(upload.single("image"), (req, response)=>{
	let db_connect = dbo.getDB();
	let myObject = {name:req.body.name, subject:req.body.subject, post:req.body.post, image:req.file.filename}
	db_connect.collection("posts").insertOne(myObject, (err, res)=>{
		if (err) {
			throw err;
		}
		response.json(res);
	})
});

// updates a specific post (without a new image) in the database
postRoutes.route("/update/:id").post((req, response)=>{
	let db_connect = dbo.getDB();
	let myQuery = {_id:objectId(req.params.id)}
	let myObject = {$set:{name:req.body.name, subject:req.body.subject, post:req.body.post}}
	db_connect.collection("posts").updateOne(myQuery, myObject, (err, res)=>{
		if (err) {
			throw err;
		}
		response.json(res);
	})
});

// updates a specific post (with a new image) in the database
postRoutes.route("/update-with-image/:id").post(upload.single("image"), (req, response)=>{
	let db_connect = dbo.getDB();
	let myQuery = {_id:objectId(req.params.id)}
	let myObject = {$set:{name:req.body.name, subject:req.body.subject, post:req.body.post, image:req.file.filename}}
	db_connect.collection("posts").updateOne(myQuery, myObject, (err, res)=>{
		if (err) {
			throw err;
		}
		response.json(res);
	})
});

// deletes a post in the database
postRoutes.route("/:id").delete((req, response)=>{
	let db_connect = dbo.getDB();
	let myQuery = {_id:objectId(req.params.id)}
	db_connect.collection("posts").deleteOne(myQuery, (err, res)=>{
		if (err) {
			throw err;
		}
		response.json(res);
	})
});

module.exports = postRoutes;