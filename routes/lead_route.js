module.exports = function(app) {
	var express = require('express');
	var router = express.Router();
	var async = require('async');

	var Product = require('../app/models/product');
	var Agent = require('../app/models/agent');
	var Customer = require('../app/models/customer');
	var Lead = require('../app/models/lead');

	var ObjectID = require('mongodb').ObjectID;	

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

	if (!ObjectID.isValid(req.body.product_id))
		res.json({Error: "Invalid Product ID!"});

	if (!ObjectID.isValid(req.body.customer_id))
		res.json({Error: "Invalid Customer ID!"});

	if (!ObjectID.isValid(req.body.agent_id))
		res.json({Error: "Invalid Agent ID!"});

	if (req.body.type != 'sale' && req.body.type != 'purchase')
		res.json({Error: "Invalid type!"})
		
	lead.product = req.body.product_id;
	lead.customer = req.body.customer_id;
	lead.agent = req.body.agent_id;
	lead.type = req.body.type;
	lead.status = "active";

    var asyncTasks = [];

    asyncTasks.push(function(callback) {
        Product.findById(req.body.product_id, function(err, product) {
            if (!product) {
                res.json("Error: Product not found!");
                return;
            }
            if (product.status != 'available') {
                res.json("Error: Product not available!");
                return;
            }
            product.leads.push(lead.id);
            product.save();
            callback();
        });
    });

    asyncTasks.push(function(callback) {
        Customer.findById(req.body.customer_id, function(err, customer) {
            if (!customer) {
                res.json("Error: Customer not found!");
                return;
            }
            customer.leads.push(lead.id);
            customer.save();
            callback();
        });
    });

    asyncTasks.push(function(callback) {
        Agent.findById(req.body.agent_id, function(err, agent) {
            if (!agent) {
                res.json("Error: Agent not found!");
                return;
            }
            agent.leads.push(lead.id);
            agent.save();
            callback();
        });
    });

    asyncTasks.push(function(callback) {
        lead.save(function(err) {
            if (err)
                res.send(err);
            callback();
        });
    });    

    async.series(asyncTasks, function() {
        res.json({Message: "Lead created!"});
    });
});

router.route('/leads/:lead_id')

.get(function(req, res) {
    if (!ObjectID.isValid(req.params.lead_id)) {
        res.json({Error: "Invalid Lead ID!"});
        return;
    }
	Lead.findById(req.params.lead_id, function(err, lead) {
		if (err)
			res.send(err);
		res.json(lead);
	});
})

.put(function(req, res) {
    if (!ObjectID.isValid(req.params.lead_id)) {
        res.json({Error: "Invalid Lead ID!"});
        return;
    }

    Lead.findById(req.params.lead_id, function(err, lead){
        if (err) {
            res.send(err);
            return;
        }
        if (!lead) {
            res.json("Error: Lead not found!");
            return;
        }

        if(req.body.status)
            lead.status = req.body.status;
        if(req.body.type)
            lead.type = req.body.type;

        var asyncTasks = [];

        asyncTasks.push(function(callback) {
            Product.findById(lead.product, function(err, product) {
                if (err) {
                    res.send(err);
                    return;
                }
                if (!product) {
                    res.json("Error: Product not found!");
                    return;
                }

                if (product.status == 'unavailable') {
                    res.json("Error: Product not available!");
                    return;
                }

                if (lead.status == 'done') {
                    product.winner_lead = lead.id;
                    product.status = 'unavailable';
                }

                product.save();
                callback();
            });
        });

        asyncTasks.push(function(callback) {
            lead.save(function(err) {
                if(err)
                    res.send(err);  
                callback();
            });
        });

        //Todo: Move all other leads associated with this product to 'cancelled' state.

        async.series(asyncTasks, function() {
            res.json({Message: "Lead updated!"});
        });
    });
})

.delete(function(req, res) {
    if (!ObjectID.isValid(req.params.lead_id)) {
        res.json({Error: "Invalid Lead ID!"});
        return;
    }
	Lead.remove({_id: req.params.lead_id}, function(err, lead){
		if (err)
			res.send(err);
		res.json({Message: "Lead deleted!"});
	});
});

app.use('/api', router);
}