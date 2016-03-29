var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var ProductSchema = new Schema({
	name: String,
	status: String,
	leads: [ObjectId],
	winner_lead : ObjectId
});

module.exports = mongoose.model('Product', ProductSchema);