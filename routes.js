// Require the routes module
// Two parenthesis indicate the require returns a function
// returned function is invoked
/*--- Each time this file changed, the server needs to be restarted ---*/
const routes = require("next-routes")();

// Add a new mapping
// First argument is pattern
// To indicate wildcard use :

routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:address", "/campaigns/show")
  .add("/campaigns/:address/requests", "/campaigns/requests/index")
  .add("/campaigns/:address/requests/new", "/campaigns/requests/new");

// Exports helper to automatically navigate users
// Exports { Link } among other features
module.exports = routes;
