module.exports = function(app) {
	var express = require('express');
	var router = express.Router();

	var Product = require('../app/models/product');

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
	var product = new Product();
	product.name = req.body.name;
	product.status = "available";

	product.save(function(err) {
		if (err)
			res.send(err);
		res.json({message: "Product created!"});
	});
});


router.route('/products/:product_id')

.get(function(req, res) {
	Product.findById(req.params.product_id, function(err, product) {
		if (err)
			res.send(err);
		res.json(product);
	});
})

.put(function(req, res) {
	Product.findById(req.params.product_id, function(err, product){
		if (err)
			res.send(err);
		product.name = req.body.name;
		product.status = req.body.status;

		product.save(function(err) {
			if(err)
				res.send(err);
			res.json({message: "Product updated!"});
		});
	});
})

.delete(function(req, res) {
	Product.remove({_id: req.params.product_id}, function(err, product){
		if (err)
			res.send(err);
		res.json({message: "Product deleted!"});
	});
});

app.use('/api', router);
}