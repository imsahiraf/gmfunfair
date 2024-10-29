const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const Merchant = require('../models/Merchant');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
	try {
		const { email, password, role } = req.body;
		if (role === 'user' && !email.endsWith('@graymatrix.com')) {
			return res.status(400).json({ message: 'User email must be from graymatrix.com' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		let account;

		if (role === 'user') {
			account = await User.create({ email, password: hashedPassword });
		} else if (role === 'merchant') {
			account = await Merchant.create({ email, password: hashedPassword });
		} else {
			return res.status(400).json({ message: 'Invalid role specified' });
		}

		account.role = role;

		const token = jwt.sign({ id: account.id, role }, process.env.JWT_SECRET);
		res.json({ token, account: { ...account.toJSON(), role }, message: "Registered successfully" });
	} catch (error) {
		console.error('Error during registration:', error);
		res.status(500).json({ message: 'An error occurred during registration' });
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const { email, password, role } = req.body;

		const account = role === 'user' 
			? await User.findOne({ where: { email } }) 
			: await Merchant.findOne({ where: { email } });

		if (!account || !(await bcrypt.compare(password, account.password))) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Assign role to account and generate token
		account.role = role;
		const token = jwt.sign({ id: account.id, role }, process.env.JWT_SECRET);

		// Include role in the response
		res.json({ token, account: { ...account.toJSON(), role } });
	} catch (error) {
		console.error('Error during login:', error);
		res.status(500).json({ message: 'An error occurred during login' });
	}
});

module.exports = router;
