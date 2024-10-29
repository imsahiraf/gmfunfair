// backend/models/User.js

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coupons: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    total_currency_received: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = User;
