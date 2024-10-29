// backend/models/Merchant.js

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Merchant = db.define('Merchant', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currencies: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    total_coupons_received: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Merchant;
