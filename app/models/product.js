var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var ProductSchema = new Schema({
	name: String,
	status: String,
	leads: [ObjectId]
});

module.exports = mongoose.model('Product', ProductSchema);