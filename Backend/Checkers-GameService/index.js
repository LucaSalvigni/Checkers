const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")

// Load .env
dotenv.config()

// Initialize express const
const app = express()
app.use(cors())
// Connect to DB
const db = ""
mongoose.connect(db, {useNewUrlParser: true, 
                    useUnifiedTopology: true})

const connection = mongoose.connection
connection.on("error", console.error.bind(console, "connection error: ")); 
connection.once("open", function () {console.log("Connected successfully to MongoDB");});

// Body Parser
app.use(express.json());

// Routes
app.use("/", require("./routes/index"))

const PORT = process.env.PORT
app.listen(PORT, function () {
    console.log('GameService started on port ' + PORT)
})