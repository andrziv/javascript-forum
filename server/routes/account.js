const express = require("express");
const accountRoutes = express.Router();
const dbo = require("../db/conn");
const objectId = require("mongodb").ObjectId;
const crypto = require('crypto'),
hash = crypto.getHashes();

// gets all of the account objects from the database
accountRoutes.route("/account").get(function (req, res) {
	let db_connect = dbo.getDB("accounts");
	db_connect
		.collection("accounts")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(result);
		});
});

// gets the account with the specific id from the database
accountRoutes.route("/account/:id").get(function (req, res) {
	let db_connect = dbo.getDB();
	let myquery = {_id: objectId(req.params.id)};
	db_connect
		.collection("accounts")
		.findOne(myquery, function (err, result) {
			if (err) throw err;
			res.json(result);
		});
});
		
// doesnt do anything 
// gets a list of tokens that are attached to the account
accountRoutes.route("/account/:id/token").get((req, res)=>{
	let db_connect = dbo.getDB();
	db_connect.collection("tokens").find({}).toArray((err, result)=>{
		if (err) {
			throw err;
		}
		res.json(result);
	})
});

// doesnt do anything 
// creates a new token tied to a specific account
accountRoutes.route("/account/:id/token-create").post((req, response)=>{
	let db_connect = dbo.getDB();
	function generateToken() {
		const d = new Date();
		const date = d.getDate();
		const day = d.getDay();
		const weekOfMonth = Math.ceil((date - 1 - day) / 7);
		return objectId(req.params.id) + weekOfMonth;
	}
	let myObject = {account_id: objectId(req.params.id), token: generateToken(), ip_addr: req.params.ip_addr}
	hashPwd = crypto.createHash('sha256')
		.update(myObject.token)
		.digest('hex');
	db_connect.collection("tokens").insertOne(myObject, (err, res)=>{
		if (err) {
			throw err;
		}
		response.json(res);
	})
});

// doesnt do anything 
// deletes a token tied to an account
accountRoutes.route("/account/:id/token/delete").delete((req, response) => {
	let db_connect = dbo.getDB();
	let myquery = { _id: objectId(req.params.id) };
	db_connect.collection("tokens").deleteOne(myquery, function (err, obj) {
		if (err) throw err;
		response.json(obj);
	});
});

// creates a new account in the database
accountRoutes.route("/account/add").post(function (req, response) {
	let db_connect = dbo.getDB();
	let myobj = {
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
	};
	db_connect.collection("accounts").insertOne(myobj, function (err, res) {
		if (err) throw err;
		response.json(res);
	});
});
		
// edits a current account in the database
accountRoutes.route("/account/edit/:id").post(function (req, response) {
	let db_connect = dbo.getDB();
	let myquery = { _id: objectId(req.params.id) };
	let newvalues = {
		$set: {
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
		},
	};
	db_connect
		.collection("accounts")
		.updateOne(myquery, newvalues, function (err, res) {
			if (err) throw err;
			// console.log("1 document updated");
			response.json(res);
		});
});
		
// deletes a specific account in the database
accountRoutes.route("/account/delete/:id").delete((req, response) => {
	let db_connect = dbo.getDB();
	let myquery = { _id: objectId(req.params.id) };
	db_connect.collection("accounts").deleteOne(myquery, function (err, obj) {
		if (err) throw err;
		// console.log("1 document deleted");
		response.json(obj);
	});
});
		
module.exports = accountRoutes;