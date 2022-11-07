const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { sign } = require('../token');

const router = express.Router();

const User = mongoose.model('User');

router.post('/signup', async (request, response) => {
	const { login, password } = request.body;
	console.table({
		password,
		passwordHash: bcrypt.hashSync(password, 10)
	})
	const user = new User({
		login,
		password_hash: bcrypt.hashSync(password, 10)
	})
	try {
		user.save();
		const token = sign({ userId: user._id });
		response.send({ token });
	} catch (err) {
		if (err.message.startsWith('E11000')) {
			response.status(422).send({ error: 'login already exists' });
		} else {
			res.status(400).send(err.message);
		}
	}
});

router.post('/login', async (request, response) => {
	const { login, password } = request.body;
	const user = await User.findOne({ login });
	if (!user) {
		return response.status(422).send({ message: 'user does not exist' });
	}
	if (bcrypt.compareSync(password, user.password_hash)) {
		const token = sign({ userId: user._id });
		response.send({ token });
	} else {
		response.status(401).send({ message: 'incorrect password' });
	}
});

module.exports = router;