const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const { MemoryStore } = require("express-rate-limit");
const handlers = require("./handlers.js");
const server_version = require("../package.json").version;

const genericLimit = rateLimit({
  windowMs: 15 * 60 * 100, // 15 minutes
  max: process.env.STATUS == "dev" ? 0 : 75, // Limit each IP per window, 0 disables rate limit
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

app.options("/", (req, res) => {
  res.header({
    Allow: "GET",
    "X-Content-Type-Options": "nosniff"
  });
  res.sendStatus(204);
});

app.get("/api/student", genericLimit, async (req, res) => {

});

app.options("/api/student", (req, res) => {

});

app.get("/api/settings/:settingsLocation", genericLimit, async (req, res) => {

});

app.post("/api/settings/:settingsLocation", genericLimit, async (req, res) => {

});

app.options("/api/settings/:settingsLocation", genericLimit, async (req, res) => {

});

app.get("/api/scans", genericLimit, async (req, res) => {

});

app.options("/api/scans", (req, res) => {

});

// Used to retreive all existing configured events.
app.get("/api/events", genericLimit, async (req, res) => {
  await handlers.getEvents(req, res);
});

// Used to modify the existing events, either creating a new one, or editing an existing one.
app.post("/api/events", genericLimit, async (req, res) => {
  await handlers.modifyEvents(req, res);
});

app.delete("/api/events", genericLimit, async (req, res) => {

});

app.options("/api/events", (req, res) => {

});

app.post("/api/submit", genericLimit, async (req, res) => {

});

app.options("/api/submit", (req, res) => {

});

app.use((req, res) => {
  // This is the 404 catcher for all endpoints. Always ensure to leave at bottom.

});

module.exports = app;
