const mongoose = require('mongoose');

const WardenSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{ 
        type: String,
        required: true
    },
    contactNumber:{
        type: String,
        required: true
    },
    profilePicture:{
        type: String,
        default: ''
    }
});


module.exports = mongoose.model('Warden', WardenSchema);