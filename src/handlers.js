
const database = require("./database.js");
const common_handler = require("./common_handler.js");
const utils = require("./utils.js");
const query = require("./query.js");

async function getEvents(req, res) {
  let params = {};

  // handle auth

  let events = await database.getAllEvents();

  if (!events.ok) {
    // handle error
    await common_handler.handleError(req, res, events);
    return;
  }

  let returnObj = await utils.combineEvents(events.content);

  res.status(200).json(returnObj);
}

async function getAnEvent(req, res) {
  let params = {
    eventID: query.eventID(req),
  };

  // handle auth

  let eventObj = await database.getSingleEvent(params.eventID);

  if (!eventObj.ok) {
    await common_handler.handleError(req, res, eventObj);
    return;
  }

  let returnObj = await utils.combineEvents(eventObj.content);

  res.status(200).json(returnObj);
}

async function deleteAnEvent(req, res) {
  let params = {
    eventID: query.eventID(req),
  };

  // handle auth

  let eventObj = await database.deleteEvent(params.eventID);

  if (!eventObj.ok) {
    await common_handler.handleError(req, res, eventObj);
    return;
  }

  res.status(201).send(); // Lets send an empty response on success to deletion.
}

async function modifyEvent(req, res) {
  let params = {
    eventID: query.eventID(req),
    task: query.task(req),
    action: query.action(req),
  };

  // Handle Auth

  // This intends to have a task of either "add", or "remove"
  // The action then is the text of an action when task is "add" and is the ID of an action when "remove"
  // That way we can modify an existing action or add one with no issue.
  if (params.task === "add") {
    // So we want to add the action specified to the eventID

    // Verify Action is valid

    let addAction = await database.addActionToEvent(params.eventID, params.action);

    if (!addAction.ok) {
      await common_handler.handleError(req, res, addAction);
      return;
    }

    res.status(200).json(addAction.content);
    return;

  } else if (params.task === "remove") {
    // We want to remove an action from the event.
  } else {
    res.status(400).json({ message: "Invalid Task Provided" });
    return;
  }
}

module.exports = {
  getEvents,
  getAnEvent,
  deleteAnEvent,
  modifyEvent,
};
