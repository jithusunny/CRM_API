var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId,
Timestamp = Schema.Timestamp;

var AgentSchema = new Schema({
	name: String,
	email: String,
	status: String,
	leads: [ObjectId]
});

module.exports = mongoose.model('Agent', AgentSchema);