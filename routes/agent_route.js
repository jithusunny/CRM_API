module.exports = function(app) {
	var express = require('express');
	var router = express.Router();

	var Agent = require('../app/models/agent');

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
	agent.email = req.body.email;

	agent.save(function(err) {
		if (err)
			res.send(err);
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
		if(agent) {
			agent.name = req.body.name;
			agent.email = req.body.email;

			agent.save(function(err) {
				if(err)
					res.send(err);
				res.json({message: "Agent updated!"});
			});
		}
	});
})

.delete(function(req, res) {
	Agent.remove({_id: req.params.agent_id}, function(err, agent){
		if (err)
			res.send(err);
		res.json({message: "Agent deleted!"});
	});
});

app.use('/api', router);
}