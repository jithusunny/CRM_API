# A basic REST API for an ecommerce website.

The data model consists of the 3 collections for modelling the parties involved:
```
Products
Customers
Agents
```

and a collection that holds the references to all the parties involved in a sale/purchase:
```
Leads
```

## Endpoints:
```
* POST /api/products 					- create a product
* GET /api/products 					- gets all products
* GET /api/products/:product_id 		- get product
* PUT /api/products 					- update product
* DELETE /api/products/:product_id 		- delete product
```
```
* POST /api/customers 					- create a customer
* GET /api/customers 					- gets all customers
* GET /api/customers/:customer_id		- get customer
* PUT /api/customer 					- update customer
* DELETE /api/customer/customer_id		- delete customer
```
```
* POST /api/agents 						- create an agent
* GET /api/agents 						- gets all agents
* GET /api/agents/:agent_id 			- get agent
* PUT /api/agents 						- update agent
* DELETE /api/agents:agent_id			- delete agent
```
```
* POST /api/leads 						- create a lead
* GET /api/leads 						- gets all leads
* GET /api/leads/:lead_id 				- get lead
* PUT /api/leads 						- update lead
* DELETE /api/leads 					- delete lead
```

### Complete a sale/purchase:
To complete a lead successfully, update(PUT) a lead with status 'done'
- winner_lead field of corresponding Prodcut will be updated with the current lead that resulted in a successful deal.
- Product status will move from 'available' to 'unavailable'.

### Cancel a sale/purchase:
To cancel a lead, update(PUT) a lead with status 'cancelled':

### States
The states a Product can be in:
* available
* unavailable

The states a Lead can be in:
* active
* done
* cancelled

Types of Leads:
* sale
* purchase



