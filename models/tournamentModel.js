const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Team = require('./teamsModel')

const Tournament = sequelize.define('Tournament', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    game: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    rules:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    organizerId:{
         type: DataTypes.INTEGER,
         allowNull: false
     }
})

module.exports = Tournament