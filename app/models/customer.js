var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var CustomerSchema = new Schema({
	name: String,
	leads: [ObjectId]
});

module.exports = mongoose.model('Customer', CustomerSchema);