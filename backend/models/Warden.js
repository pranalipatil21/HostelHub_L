const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Warden = sequelize.define('Warden',{

    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },

    name:{
        type:DataTypes.STRING,
        allowNull:false
    },

    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true
        }
    },

    password:{
        type:DataTypes.STRING,
        allowNull:false
    },

    contactNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },

    profilePicture:{
        type:DataTypes.STRING
    }

},{
    timestamps:true
});

module.exports = Warden;