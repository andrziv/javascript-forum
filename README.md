# javascript-forum

### Short Introduction
Simple forum made in javascript.
Uses react for front-end development, express.js and node.js for the server/back-end and mongodb for the database.

### Change the config.env file for your Account
To make the project work, in server > config.env, change the <initials> to the initials of your mongodb atlas account name, 
and the <password> the password of your mongodb atlas account. Alternatively, just follow the instructions on the mongodb atlas website
when attempting to connect the database to the project, and replace line 1 with what they give you.

### Might need to make an "images" folder in server
If there is an error where multer isn't able to save the image to the server, it might be because the "images" folder in server
is missing.

## What the project does
This project is a simple forum that uses node.js to host to localhost on port 5000. It allows for simple post creation, editing, 
commenting on posts and creating and using very simple accounts. 
