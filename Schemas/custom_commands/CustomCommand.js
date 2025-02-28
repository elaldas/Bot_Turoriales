const { model, Schema } = require("mongoose");

const customCommandSchema = new Schema({
	guildId: String,
	commandName: String,
	commandId: String,
	content: String,
});

module.exports = model("customCommandModel", customCommandSchema);
