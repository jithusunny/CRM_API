module.exports = function(app) {
	var express = require('express');
	var router = express.Router();

	var Customer = require('../app/models/customer');

//Handle requests for customers
router.route('/customers')

.get(function(req, res) {
	Customer.find(function(err, customers) {
		if(err)
			res.send(err);
		res.json(customers);
	})
})

.post(function(req, res) {
	var customer = new Customer();
	customer.name = req.body.name;
	customer.email = req.body.email;

	customer.save(function(err) {
		if (err)
			res.send(err);
		res.json({message: "Customer created!"});
	});
});

router.route('/customers/:customer_id')

.get(function(req, res) {
	Customer.findById(req.params.customer_id, function(err, customer) {
		if (err)
			res.send(err);
		res.json(customer);
	});
})

.put(function(req, res) {
	Customer.findById(req.params.customer_id, function(err, customer){
		if (err)
			res.send(err);
		customer.name = req.body.name;
		customer.email = req.body.email;

		customer.save(function(err) {
			if(err)
				res.send(err);
			res.json({message: "Customer updated!"});
		});
	});
})

.delete(function(req, res) {
	Customer.remove({_id: req.params.customer_id}, function(err, customer){
		if (err)
			res.send(err);
		res.json({message: "Customer deleted!"});
	});
});

app.use('/api', router);
}