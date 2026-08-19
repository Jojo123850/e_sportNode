const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Team = sequelize.define('Team', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = Team