var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var LeadSchema = new Schema({
	status: String,
	agent: ObjectId,
	customer: ObjectId,
	product:ObjectId
});

module.exports = mongoose.model('Lead', LeadSchema);