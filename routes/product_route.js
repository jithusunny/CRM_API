module.exports = function(app) {
	var express = require('express');
	var router = express.Router();

	var Product = require('../app/models/product');
	var ObjectID = require('mongodb').ObjectID;

//Handle requests for products
router.route('/products')

.get(function(req, res) {
	Product.find(function(err, products) {
		if(err)
			res.send(err);
		res.json(products);
	})
})

.post(function(req, res) {
	if (!req.body.name) {
		res.json({Error: "Name of the Product is missing!"});
		return;
	}
	var product = new Product();
	product.name = req.body.name;
	product.status = "available";

	product.save(function(err) {
		if (err)
			res.send(err);
		res.json({Message: "Product created!"});
	});
});


router.route('/products/:product_id')

.get(function(req, res) {
	if (!ObjectID.isValid(req.params.product_id)) {
		res.json({Error: "Invalid Product ID!"});
		return;
	}

	Product.findById(req.params.product_id, function(err, product) {
		if (err)
			res.send(err);
		res.json(product);
	});
})

.put(function(req, res) {
	if (!ObjectID.isValid(req.params.product_id)) {
		res.json({Error: "Invalid Product ID!"});
		return;
	}
	Product.findById(req.params.product_id, function(err, product){
		if (err) {
			res.send(err);
			return;
		}
		if(!product) {
			res.json({Error: "Product not found!"});
			return;
		}

		if (req.body.name)
			product.name = req.body.name;
		if (req.body.status)
			product.status = req.body.status;

		product.save(function(err) {
			if(err)
				res.send(err);
			res.json({Message: "Product updated!"});
		});
	});
})

.delete(function(req, res) {
	if (!ObjectID.isValid(req.params.product_id)) {
		res.json({Error: "Invalid Product ID!"});
		return;
	}
	Product.remove({_id: req.params.product_id}, function(err, product){
		if (err) {
			res.send(err);
			return;
		}
		if(!product) {
			res.json({Error: "Product not found!"});
			return;
		}
		res.json({Message: "Product deleted!"});
	});
});

app.use('/api', router);
}