// informs nextjs to use the routing

const { createServer } = require("http");
const next = require("next");

// Dev flag indicates whether this is development or production
// Look at the environment variable to see whether this is production
const app = next({
  dev: process.env.NODE_ENV !== "production",
});

const routes = require("./routes");
const handler = routes.getRequestHandler(app);

// Informs the app to listen to a specific port
app.prepare().then(() => {
  createServer(handler).listen(3000, (err) => {
    if (err) throw err;
    console.log("Ready on localhost:3000");
  });
});
