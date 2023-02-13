const express = require('express');
const morgan = require('morgan');
const path = require("path")
const cors = require('cors')
require("dotenv").config()
const app = express();
const mongoose = require('mongoose');
const ObjectRouter = require('./backend/routes/Object.route')

//* Database
var db = mongoose.connect(
    process.env.MONGO_URI,
	() => console.log("Connected to database")
)
db.catch(error => {
    console.error("Error connecting to mongoDB")
    process.exit(1)
})

//* Routes
// Handle requests to the /api/models route
app.use('/api/models', ObjectRouter)

//* Middleware
// Allow CORS access from any origin
app.use(cors({ exposedHeaders: ["Authorization"] }))
// Parse JSON request bodies
app.use(express.json())
// Log requests and responses to the console
app.use(morgan('dev'));
// Serve the /public directory as a static file
app.use('/public', express.static(path.join(__dirname, '/public')))
// Handle errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

// Serve the /dist directory as a static file
app.use(express.static(path.join(__dirname, "/dist")))
// If no route was matched, serve index.html
app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname + "/dist/index.html"))
)
// Start the server
const PORT = process.env.PORT || 3000
const HOST = "localhost"
const server = app.listen(PORT, HOST, () =>
	console.log("Aevum server started on " + HOST + ":" + PORT + " started")
)