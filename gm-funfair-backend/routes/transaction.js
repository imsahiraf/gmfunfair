const express = require('express');
const router = express.Router();
const db = require('../config/db');
const User = require('../models/User');
const Merchant = require('../models/Merchant');
const Transaction = require('../models/Transaction');

// Get transaction history
router.post('/fetch-transactions', async (req, res) => {
	try {
		const { userId, merchantId } = req.body;
		let transactions, userData, topUsers, topMerchants;

		if (userId) {
			transactions = await Transaction.findAll({ where: { user_id: userId }, order: [['id', 'DESC']] });
			userData = await User.findByPk(userId);
		} else if (merchantId) {
			transactions = await Transaction.findAll({ where: { merchant_id: merchantId }, order: [['id', 'DESC']] });
			userData = await Merchant.findByPk(merchantId);
		}

		topUsers = await User.findAll({ order: [['total_currency_received', 'DESC']], limit: 3 });
		topMerchants = await Merchant.findAll({ order: [['total_coupons_received', 'DESC']], limit: 3 });

		res.json({ transactions, userData, topUsers, topMerchants });
	} catch (error) {
		console.error('Error fetching transactions:', error);
		res.status(500).json({ message: 'Error fetching transactions' });
	}
});

// Create a transaction
router.post('/transaction', async (req, res) => {
	try {
		const { userId, merchantId, amount, type } = req.body;
		const user = await User.findByPk(userId);
		const merchant = await Merchant.findByPk(merchantId);
		let paid_by, paid_to;

		// Transaction logic
		const userCoupons = Number(user.coupons);
		const merchantCurrencies = Number(merchant.currencies);
		const merchantTotalCoupons = Number(merchant.total_coupons_received);
		const userTotalCurrency = Number(user.total_currency_received);

		if (type === 'coupon' && parseInt(userCoupons) >= parseInt(amount)) {
			user.coupons = parseInt(userCoupons) - parseInt(amount);
			merchant.total_coupons_received = parseInt(merchantTotalCoupons) + parseInt(amount);
			paid_by = user.email;
			paid_to = merchant.email;
		} else if (type === 'currency' && parseInt(merchantCurrencies) >= parseInt(amount)) {
			merchant.currencies = parseInt(merchantCurrencies) - parseInt(amount);
			user.total_currency_received = parseInt(userTotalCurrency) + parseInt(amount);
			paid_by = merchant.email;
			paid_to = user.email;
		} else {
			return res.status(400).json({ message: "Invalid transaction" });
		}

		await user.save();
		await merchant.save();
		const transaction = await Transaction.create({ user_id: userId, merchant_id: merchantId, paid_by, paid_to, amount, type });
		res.json({ message: "Transaction successful", transaction });
	} catch (error) {
		console.error('Error creating transaction:', error);
		res.status(500).json({ message: 'Error creating transaction' });
	}
});

module.exports = router;
