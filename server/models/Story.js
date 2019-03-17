const mongoose = require('mongoose')
const Schema = mongoose.Schema


const storySchema = new Schema({
	title: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	imageUrl: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	likes: {
		type: Number,
		default: 0
	}
})


module.exports = mongoose.model('Story', storySchema)