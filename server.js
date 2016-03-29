//Get references to packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var async = require('async');

//app will now use bodyParser() to extract data from POST request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Get the collection definitions
var Product = require('./app/models/product');
var Agent = require('./app/models/agent');
var Customer = require('./app/models/customer');
var Lead = require('./app/models/lead');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Zefo');

var router = express.Router();

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
	product.status = req.body.status;

	product.save(function(err) {
		if (err) {
			console.log('3')
			res.send(err);
		}
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
		product.winner_lead = req.body.winner_lead;
		product.leads = req.body.leads;

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


//Handle requests for agents
router.route('/agents')

.get(function(req, res) {
	Agent.find(function(err, agents) {
		if(err)
			res.send(err);
		res.json(agents);
	})
})

.post(function(req, res) {
	var agent = new Agent();
	agent.name = req.body.name;

	agent.save(function(err) {
		if (err) {
			console.log('3')
			res.send(err);
		}
		res.json({message: "Agent created!"});
	});
});

router.route('/agents/:agent_id')

.get(function(req, res) {
	Agent.findById(req.params.agent_id, function(err, agent) {
		if (err)
			res.send(err);
		res.json(agent);
	});
})

.put(function(req, res) {
	Agent.findById(req.params.agent_id, function(err, agent){
		if (err)
			res.send(err);
		agent.name = req.body.name;

		agent.save(function(err) {
			if(err)
				res.send(err);
			res.json({message: "Agent updated!"});
		});
	});
})

.delete(function(req, res) {
	Agent.remove({_id: req.params.agent_id}, function(err, agent){
		if (err)
			res.send(err);
		res.json({message: "Agent deleted!"});
	});
})


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

	customer.save(function(err) {
		if (err) {
			console.log('3')
			res.send(err);
		}
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
})


//Handle requests for leads
router.route('/leads')

.get(function(req, res) {
	Lead.find(function(err, leads) {
		if(err)
			res.send(err);
		res.json(leads);
	})
})

.post(function(req, res) {
	var lead = new Lead();
	lead.product = req.body.product_id;
	lead.customer = req.body.customer_id;
	lead.agent = req.body.agent_id;
	lead.type = req.body.type;
	lead.status = "active";

	lead.save(function(err) {
		if (err)
			res.send(err);
		Product.findById(req.body.product_id, function(err, product) {
			if (err)
				res.send(err);
			product.leads.push(lead.id);
			product.status = "active";
			product.save();
		});

		Agent.findById(req.body.agent_id, function(err, agent) {
			agent.leads.push(lead.id);
			agent.status = "active";
			agent.save();
		});

		Customer.findById(req.body.customer_id, function(err, customer) {
			customer.leads.push(lead.id);
			customer.save();
		});

		res.json({message: "Lead created!"});
	});
});

router.route('/leads/:lead_id')

.get(function(req, res) {
	Lead.findById(req.params.lead_id, function(err, lead) {
		if (err)
			res.send(err);
		res.json(lead);
	});
})

.put(function(req, res) {
	Lead.findById(req.params.lead_id, function(err, lead){
		if (err)
			res.send(err);
		lead.name = req.body.name;

		lead.save(function(err) {
			if(err)
				res.send(err);
			res.json({message: "Lead updated!"});
		});
	});
})

.delete(function(req, res) {
	Lead.remove({_id: req.params.lead_id}, function(err, lead){
		if (err)
			res.send(err);
		res.json({message: "Lead deleted!"});
	});
})


app.use('/api', router);

app.listen('8080');
console.log('Waiting for requests at port 8080');