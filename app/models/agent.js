var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var AgentSchema = new Schema({
	name: String,
	email: String,
	leads: [ObjectId]
});

module.exports = mongoose.model('Agent', AgentSchema);