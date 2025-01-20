const { Schema, model } = require("mongoose")

const blacklist = new Schema({

	user: {
		type: String,
		required: true
	},
	reason: {
		type: String,
		required: true
	},
	motive: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: false
	},
	moderator: {
		type: String,
		required: false
	}
})

module.exports = model("BlacklistSchema", blacklist)