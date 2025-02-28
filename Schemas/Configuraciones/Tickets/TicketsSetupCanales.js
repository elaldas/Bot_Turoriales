const { model, Schema } = require("mongoose");

const canales = new Schema({
	ServerID: {
		type: String,
		required: true,
	},
	Canal: {
		type: String,
		required: true,
	},
	AuthorID: {
		type: String,
		required: true,
	},
	Cerrado: {
		type: String,
		required: true,
	},
});

module.exports = model("TicketsSetupCanales", canales);
