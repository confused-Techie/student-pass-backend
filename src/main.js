const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const { MemoryStore } = require("express-rate-limit");
const handlers = require("./handlers.js");
const server_version = require("../package.json").version;

const genericLimit = rateLimit({
  windowMs: 15 * 60 * 100, // 15 minutes
  max: process.env.STATUS == "dev" ? 0 : 200, // Limit each IP per window, 0 disables rate limit
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: true, // Legacy rate limit info in headers
  store: new MemoryStore(), // Use default memory store
  message: "Too many requests, please try again later.", // Message once limit is reached
  handler: (request, response, next, options) => {
    // Custom handling
    response.status(options.statusCode).json({ message: options.message });
    // log request
  }
});

// Enabled to allow the proper IP address to be pulled from Google App Engine
app.set("trust proxy", true);

app.use((req, res, next) => {
  // Used to add the start time of the request to every request.
  req.start = Date.now();
  // Add a trace?
  next();
});

app.get("/", genericLimit, (req, res) => {
  res.status(200).json({ message: `The Server is up and running: ${server_version}` });
});

// Used to retreive all existing configured events.
app.get("/api/events", genericLimit, async (req, res) => {
  await handlers.getEvents(req, res);
});

// Get a single event
app.get("/api/events/:eventID", genericLimit, async (req, res) => {
  await handlers.getAnEvent(req, res);
});

// Allows adding or removing a single action from an event.
app.post("/api/events/:eventID", genericLimit, async (req, res) => {
  await handlers.ModifyEvent(req, res);
});

// Used to Delete a specific event.
app.delete("/api/events/:eventID", genericLimit, async (req, res) => {
  await handlers.deleteAnEvent(req, res);
});

app.options("/api/events", (req, res) => {

});

app.use((req, res) => {
  // This is the 404 catcher for all endpoints. Always ensure to leave at bottom.

});

module.exports = app;
