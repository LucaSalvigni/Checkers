const mongoose = require("mongoose")

const certificateSchema = new mongoose.Schema({
    name: String,
    value: String
})
module.exports = mongoose.model("certificates", certificateSchema)