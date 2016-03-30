module.exports = function(app) {
	var express = require('express');
	var router = express.Router();

	var Product = require('../app/models/product');
	var Agent = require('../app/models/agent');
	var Customer = require('../app/models/customer');
	var Lead = require('../app/models/lead');

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
			product.save();
		});

		Agent.findById(req.body.agent_id, function(err, agent) {
			agent.leads.push(lead.id);
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
		lead.status = req.body.status;
		lead.type = req.body.type;

		Product.findById(req.body.product_id, function(err, product) {
			if (err)
				res.send(err);

			if (lead.status == 'done') {
				product.winner_lead = lead.id;
				product.status = 'unavailable';
			}

			if (lead.status == 'cancelled')
				product.status = 'unavailable';

				product.save();
		});

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
});

app.use('/api', router);
}