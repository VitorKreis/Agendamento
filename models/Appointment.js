const mongoose = require('mongoose')


const appointmnet = new mongoose.Schema({
    name: String,
    email: String,
    cpf: String,
    date: Date,
    time: String,
    finishid: Boolean,
    notified: Boolean 
})


module.exports = appointmnet