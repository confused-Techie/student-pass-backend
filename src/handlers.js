
const database = require("./database.js");
const common_handler = require("./common_handler.js");

async function getEvents(req, res) {
  let params = {};

  // handle auth

  let events = await database.getAllEvents();

  if (!events.ok) {
    // handle error
    await common_handler.handleError(req, res, events);
    return;
  }

  res.status(200).json(events.content);
}

module.exports = {
  getEvents,
};
