module.exports = function(app) {
	var express = require('express');
	var router = express.Router();

	var Customer = require('../app/models/customer');
	var ObjectID = require('mongodb').ObjectID;

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
	if (!req.body.name) {
		res.json({Error: "Name of the Customer is missing!"});
		return;
	}
	if (!req.body.email) {
		res.json({Error: "Email of the Customer is missing!"});
		return;
	}
	var customer = new Customer();
	customer.name = req.body.name;
	customer.email = req.body.email;

	customer.save(function(err) {
		if (err)
			res.send(err);
		res.json({Message: "Customer created!"});
	});
});

router.route('/customers/:customer_id')

.get(function(req, res) {
	if (!ObjectID.isValid(req.params.customer_id)) {
		res.json({Error: "Invalid Customer ID!"});
		return;
	}
	Customer.findById(req.params.customer_id, function(err, customer) {
		if (err)
			res.send(err);
		res.json(customer);
	});
})

.put(function(req, res) {
	if (!ObjectID.isValid(req.params.customer_id)) {
		res.json({Error: "Invalid Customer ID!"});
		return;
	}
	Customer.findById(req.params.customer_id, function(err, customer){
		if (err) {
			res.send(err);
			return;
		}
		if(!customer) {
			res.json({Error: "Customer not found!"});
			return;
		}
		if(req.body.name)
			customer.name = req.body.name;
		if(req.body.email)
			customer.email = req.body.email;

		customer.save(function(err) {
			if(err)
				res.send(err);
			res.json({Message: "Customer updated!"});
		});
	});
})

.delete(function(req, res) {
	if (!ObjectID.isValid(req.params.customer_id)) {
		res.json({Error: "Invalid Customer ID!"});
		return;
	}
	Customer.remove({_id: req.params.customer_id}, function(err, customer){
		if (err) {
			res.send(err);
			return;
		}
		if(!customer) {
			res.json({Error: "Customer not found!"});
			return;
		}
		res.json({Message: "Customer deleted!"});
	});
});

app.use('/api', router);
}