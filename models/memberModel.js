const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Member = sequelize.define('Member', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    indexes: [
        { unique: true, fields: ['userId', 'teamId'] }
    ]
})

module.exports = Member