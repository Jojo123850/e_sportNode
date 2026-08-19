const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Tournament = require('./tournamentModel')

const Registered = sequelize.define('Registered', {
    tournamentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    indexes: [
        { unique: true, fields: ['tournamentId', 'teamId'] }
    ]
})

module.exports = Registered