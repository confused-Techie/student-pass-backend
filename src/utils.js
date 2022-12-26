
async function decodeQueryActions(paramAction) {
  // This expects a string of actions seperated by commas, with no periods.
  let action_array = paramAction.split(",");

  return {
    ok: true,
    content: action_array
  };
}

async function encodeQueryActionsSQL(actions) {
  // Expects a valid array of string actions, that it will need to encode to a string
  // to be inserted into the backend

  let encoded = "'{";

  for (let i = 0; i < actions.length; i++) {
    encoded += `"${actions[i]}"`;
    if (i < actions.length-1) {
      encoded += ",";
    }
  }

  encoded += "}'";

  return {
    ok: true,
    content: encoded
  };
}

async function combineEvents(obj) {
  // This function expects a full return from database.getAllEvents()
  // And will combine any actions for the same event. Resulting in a friendly
  // and shorter object to return.

  // Expects an object like below:
  /**
  [
    {
      id: 1,
      event_name: "Name of Event",
      action_name: "Name of action attached.",
      event_id: 1
    }
  ]
  */

  let retObj = []; // The object to return.
  let knownEvents = []; // An array of only the Event ID's we have seen before.

  for (let i = 0; i < obj.length; i++) {
    if (knownEvents.includes(obj[i].event_id)) {
      // Since we have seen this event ID before, we want to ensure we add the action
      // associated to the same event already in our return object.
      for (let j = 0; j < retObj.length; j++) {
        if (retObj[j].event_id == obj[i].event_id) {
          // We have now found our same previously added event ID
          // Now we just want to add our new action to the actions array
          retObj[j].actions.push({
            action_name: obj[i].action_name,
            action_id: obj[i].action_id,
          });
        }
      }
    } else {
      // We have never seen this event before, and can safely add it fully to the
      // return object.

      // But first we want to customize our object.
      let tmpObj = {
        name: obj[i].event_name,
        actions: [
          {
            action_name: obj[i].action_name,
            action_id: obj[i].action_id,
          }
        ],
        event_id: obj[i].event_id,
      };
      retObj.push(tmpObj);

      // Then we want to add our event_id into the known events array
      knownEvents.push(tmpObj.event_id);
    }
  }

  return retObj;

}

module.exports = {
  decodeQueryActions,
  encodeQueryActionsSQL,
  combineEvents,
};
