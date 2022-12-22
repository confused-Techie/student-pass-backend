
const database = require("./database.js");
const common_handler = require("./common_handler.js");
const utils = require("./utils.js");

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

async function modifyEvents(req, res) {
  let params = {
    type: req.query.type, // The action to take, valid 'update' or 'new'
    id: req.query.id, // Needed for type = 'update'
    name: req.query.name, // Needed for either
    actions: req.query.actions, // Needed for either, 'Array' String seperated by commas.
  };

  if (params.type === "update") {
    let eventData = await database.getEventByID(params.id);

    if (!eventData.ok) {
      await common_handler.handleError(req, res, eventData);
      return;
    }

    let actions = await utils.decodeQueryActions(params.actions);

    if (!actions.ok) {
      await common_handler.handleError(req, res, actions);
      return;
    }

    let write = await database.setEventByID(params.id, params.name, actions.content);

    if (!write.ok) {
      await common_handler.handleError(req, res, write);
      return;
    }

    // Now we have successfully written our new settings let's reutrn the new settings and success

    res.status(201).json(write.content);
    return;

  } else if (params.type === "new") {

  } else {
    await common_handler.handleError(req, res, {
      ok: false,
      short: "Server Error",
      content: "Invalid Type",
      detail: `modifyEvents Unable to Parse params.type: ${params.type}`
    });
    return;
  }
}

module.exports = {
  getEvents,
  modifyEvents,
};
