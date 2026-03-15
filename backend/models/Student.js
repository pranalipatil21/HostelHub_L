const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {

    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },

    name:{
        type: DataTypes.STRING,
        allowNull:false
    },

    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true
        }
    },

    password:{
        type: DataTypes.STRING,
        allowNull:false
    },

    PRN:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true
    },

    contactNumber:{
        type: DataTypes.STRING
    },

    profilePicture:{
        type: DataTypes.STRING
    },

    branch:{
        type: DataTypes.STRING
    },

    year:{
        type: DataTypes.INTEGER
    },

    CGPA:{
        type: DataTypes.FLOAT,
        defaultValue:0
    },

    permanentAddress:{
        type: DataTypes.TEXT
    },

    currentAddress:{
        type: DataTypes.TEXT
    },

    parentName:{
        type: DataTypes.STRING
    },

    parentEmail:{
        type: DataTypes.STRING
    },

    parentContactNumber:{
        type: DataTypes.STRING
    },

    guardianName:{
        type: DataTypes.STRING
    },

    guardianEmail:{
        type: DataTypes.STRING
    },

    guardianContactNumber:{
        type: DataTypes.STRING
    },

    guardianAddress:{
        type: DataTypes.TEXT
    },

    profileCompleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },

    wantsHostelNextYear:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }

},{
    timestamps:true
});

module.exports = Student;