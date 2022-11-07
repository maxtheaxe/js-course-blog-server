const express = require('express');
const mongoose = require('mongoose');
const { verify } = require('../token');

const router = express.Router();

const Post = mongoose.model('Post');

router.get('', async (request, response) => {
	try {
		const posts = await Post.find();
		response.send(posts);
	} catch(e) {
		response.status(500).send({ message: e.message });
	}
})

router.get('/:id', async (request, response) => {
	// console.log(request.params.id);
	const post = await Post.findById(request.params.id);
	response.send(post);
})

router.post('', async (request, response) => {
	const token = request.headers.authorization;
	try {
		const data = verify(token);
		console.log(data);
		console.log(request.body);
		const post = new Post({
			title: request.body.title,
			body: request.body.body
		})
		await post.save();
		response.send(post);
	} catch (e) {
		response.status(400).send({ message: e.message });
	}
})

router.patch('/:id', async (request, response) => {
	const token = request.headers.authorization;
	try {
		const data = verify(token);
		console.log(data);
		const post = await Post.findByIdAndUpdate(
			request.params.id,
			request.body,
			{ new: true }
		);
		// {title?: 'new title', body?: 'new body'}
		response.send(post);
	} catch(e) {
		response.status(400).send({ message: e.message });
	}
})

router.delete('/:id', async (request, response) => {
	const token = request.headers.authorization;
	try {
		const data = verify(token);
		console.log(data);
		const post = await Post.findById(request.params.id).deleteOne();
		response.send({ message: `post ${request.params.id} successfully deleted`});
	} catch(e) {
		response.status(400).send({ message: e.message });
	}
})

// router.get('/hello', (request, response) => {
// 	// response.send("hello, world!");
// 	response.status(200).send({message: "hello, world!"});
// })

module.exports = router;
