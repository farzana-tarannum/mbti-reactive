'use strict';

const express = require('express');
const connect = require('./database/conn');
const Profile = require('./models/profileModel');


const app = express();
const port = process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// routes
app.use('/', require('./routes/profile')(Profile));

connect().then(() => {
    try {
        // start server
        const server = app.listen(port);
        console.log('Express started. Listening on %s', port);
    } catch (er) {
        console.log("Can't connect to the server");
    }

}).catch((error) => {
    console.log("Invalid database connection");
})


