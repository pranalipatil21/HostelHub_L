const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    PRN:{
        type: String,
        required: true,
        unique: true
    },
    branch:{
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    SGPA:{
        type: [Number],
        default: []
    },
    CGPA:{
        type: Number,
        default: 0
    },
    roomNumber:{
        type: String,
        required: true
    },
    contactNumber:{
        type: String,
        required: true
    },
    permanentAddress:{
        type: String,
        required: true
    },
    currentAddress:{
        type: String,
        required: true
    },
    profilePicture:{
        type: String,
        default: ''
    },
    parentName:{
        type: String,
        required: true
    },
    parentEmail:{
        type: String,
        required: true
    },
    parentContactNumber:{
        type: String,
        required: true
    },
    guardianName:{
        type: String,
        required: true
    },
    guardianEmail:{
        type: String,
        required: true
    },
    guardianContactNumber:{
        type: String,
        required: true
    },
    guardianAdress:{
        type: String,
        required: true
    },
    
}, { timestamps: true });


module.exports = mongoose.model('Student', UserSchema);