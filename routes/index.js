module.exports = function(app) {
	require('./product_route')(app);
	require('./customer_route')(app);
	require('./agent_route')(app);
	require('./lead_route')(app);
}