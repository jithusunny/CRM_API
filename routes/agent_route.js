module.exports = function(app) {
	var express = require('express');
	var router = express.Router();

	var Agent = require('../app/models/agent');
	var ObjectID = require('mongodb').ObjectID;

//Handle requests for agents
router.route('/agents')

.get(function(req, res) {
	Agent.find(function(err, agents) {
		if(err)
			res.send(err);
		res.json(agents);
	});
})

.post(function(req, res) {
	if (!req.body.name) {
		res.json({Error: "Name of the Agent is missing!"});
		return;
	}
	if (!req.body.email) {
		res.json({Error: "Email of the Agent is missing!"});
		return;
	}
	var agent = new Agent();
	agent.name = req.body.name;
	agent.email = req.body.email;

	agent.save(function(err) {
		if (err)
			res.send(err);
		res.json({Message: "Agent created!"});
	});
});

router.route('/agents/:agent_id')

.get(function(req, res) {
	if (!ObjectID.isValid(req.params.agent_id)) {
		res.json({Error: "Invalid Agent ID!"});
		return;
	}
	Agent.findById(req.params.agent_id, function(err, agent) {
		if (err)
			res.send(err);
		res.json(agent);
	});
})

.put(function(req, res) {
	if (!ObjectID.isValid(req.params.agent_id)) {
		res.json({Error: "Invalid Agent ID!"});
		return;
	}
	Agent.findById(req.params.agent_id, function(err, agent){
		if (err) {
			res.send(err);
			return;
		}
		if(!agent) {
			res.json({Error: "Agent not found!"});
			return;
		}
		if(req.body.name)
			agent.name = req.body.name;
		if(req.body.email)
			agent.email = req.body.email;

		agent.save(function(err) {
			if(err)
				res.send(err);
			res.json({Message: "Agent updated!"});
		});
	});
})

.delete(function(req, res) {
	if (!ObjectID.isValid(req.params.agent_id)) {
		res.json({Error: "Invalid Agent ID!"});
		return;
	}
	Agent.remove({_id: req.params.agent_id}, function(err, agent){
		if (err) {
			res.send(err);
			return;
		}
		if(!agent) {
			res.json({Error: "Agent not found!"});
			return;
		}
		res.json({Message: "Agent deleted!"});
	});
});

app.use('/api', router);
}