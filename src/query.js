function eventID(req) {
  return req.params.eventID;
};

function task(req) {
  let def = "";
  let prov = req.query.task ?? def;
  let valid = [ "add", "remove" ];

  return valid.includes(prov) ? prov : def;
}

function action(req) {
  // Action can accept the Action ID or can accept a string base of a new action.
  let def = "";
  let prov = req.query.action ?? def;

  if (typeof prov === "number") {
    return prov;
  } else if (typeof prov === "string") {
    return prov;
  } else {
    return def;
  }
}

module.exports = {
  eventID,
  task,
  action,
};
