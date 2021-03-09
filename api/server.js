// BUILD YOUR SERVER HERE
// Imports at the top
const express = require('express');
const Users = require('./users/model.js');

// Instance of Express App
const server = express();

// Global Middleware
server.use(express.json());

// <-- Endpoints -->
// POST ('/api/users')
server.post('/api/users', async (req, res) => {
    try {
        const newUser = req.body;
        if(!newUser.name || !newUser.bio) {
            res.status(422).json({ message: "Please provide name and bio for the user" })
            //Unprocessable Entity response status code
            //The HyperText Transfer Protocol (HTTP) 422 Unprocessable Entity 
            //response status code indicates that the server understands the 
            //content type of the request entity, and the syntax of the request 
            //entity is correct, but it was unable to process the contained 
            //instructions.
        } else {
            const postedUser = await Users.insert(newUser);
            res.status(201).json(postedUser);
            //The HTTP 201 Created success status response code indicates 
            //that the request has succeeded and has led to the creation 
            //of a resource. ... The common use case of this status code is 
            //as the result of a POST request.
        }
    } catch(err) {
        res.status(500).json({ message: "There was an error while saving the user to the database" })
        //The HyperText Transfer Protocol (HTTP) 500 
        //Internal Server Error server error response code 
        //indicates that the server encountered an unexpected 
        //condition that prevented it from fulfilling the request. 
        //This error response is a generic "catch-all" response.
    }
})
// GET ('/api/users')
server.get('/api/users', async (req, res) => {
    try {
      const allUsers = await Users.find();
      res.status(200).json(allUsers);
    } catch(err) {
        res.status(500).json({ message: "There was an error while saving the user to the database" })
        //The HyperText Transfer Protocol (HTTP) 500 
        //Internal Server Error server error response code 
        //indicates that the server encountered an unexpected 
        //condition that prevented it from fulfilling the request. 
        //This error response is a generic "catch-all" response.
    }

})
// GET  ('/api/users/:id')
server.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userByID = await Users.findById(id);
        if (!userByID) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else {
            res.json(userByID);
        }
    } catch(err) {
        res.status(500).json({ message: "The user information could not be retrieved" });
    }
})
// DELETE ('/api/users/:id')
server.delete('/api/users/:id', async (req, res) => {
    try {
        const deleted = await Users.remove(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else {
            res.json(deleted);
        }
    } catch(err) {
        res.status(500).json({ message: "The user could not be removed" })
    }
})
// PUT ('/api/users/:id)
server.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if(!updates.name || !updates.bio) {
            res.status(422).json({ message: "Please provide name and bio for the user" })
        } else {
            const updatedUser = await Users.update(id, updates);
            if(!updatedUser) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            } else {
                res.status(200).json(updatedUser);
            }
        }
    } catch(err) {
        res.status(500).json({ message: "The user information could not be modified" });
    }
})

// Exposing the server to other modules
module.exports = server; // EXPORT YOUR SERVER instead of {}
