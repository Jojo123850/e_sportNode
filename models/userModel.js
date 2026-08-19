const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('joueur', 'capitaine', 'organisateur', 'admin'),
        allowNull: false,
        defaultValue: 'joueur'
    }
})

module.exports = User