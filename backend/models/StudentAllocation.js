const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentAllocation = sequelize.define('StudentAllocation',{

    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },

    sgpa:{
        type:DataTypes.FLOAT,
        allowNull:false
    },

    rank:{
        type:DataTypes.INTEGER
    },

    status:{
        type:DataTypes.ENUM(
            'waiting',
            'eligible',
            'confirmed',
            'declined',
            'allocated'
        ),
        defaultValue:'waiting'
    }

},{
    timestamps:true
});

module.exports = StudentAllocation;