// backend/models/Transaction.js

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Transaction = db.define('Transaction', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    merchant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
	paid_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paid_to: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Transaction;
