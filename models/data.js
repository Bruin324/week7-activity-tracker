const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    activities: [{
        name: {type: String, required: true},
        stats: [{
            date: {type: Date, required: true},
            // dateFormated: {type: String, required: true},
            stat: {type: Number, required: true}
        }]
    }]
})

const User = mongoose.model('User', userSchema)

module.exports = User;