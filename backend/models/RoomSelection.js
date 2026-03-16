const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomSelection = sequelize.define('RoomSelection',{

    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },

    selectedAt:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }

},{
    timestamps:true
});

module.exports = RoomSelection;