const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Floor = sequelize.define('Floor',{

    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },

    floorNumber:{
        type:DataTypes.INTEGER,
        allowNull:false
    }

},{
    timestamps:true
});

module.exports = Floor;