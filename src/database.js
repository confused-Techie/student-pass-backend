const postgres = require("postgres");
const fs = require("fs");
const { DB_HOST, DB_USER, DB_PASS, DB_DB, DB_PORT, DB_SSL_CERT } = require("./config.js").getConfig();

let sqlStorage; // SQL Object, to interact with the DB.

function setupSQL() {
  return process.env.STATUS === "dev"
    ? postgres({
      host: DB_HOST,
      username: DB_USER,
      database: DB_DB,
      port: DB_PORT
    })
    : postgres({
      host: DB_HOST,
      username: DB_USER,
      password: DB_PASS,
      database: DB_DB,
      port: DB_PORT,
      ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(DB_SSL_CERT).toString()
      }
    });
}

async function shutdownSQL() {
  if (sqlStorage !== undefined) {
    await sqlStorage.end();
  }
}

async function getAllEvents() {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`
      SELECT *
      FROM events AS e INNER JOIN actions AS a ON (a.event_id = e.event_id)
    `;
    console.log(command);
    return command.count !== 0
      ? { ok: true, content: command }
      : {
          ok: false,
          content: `Events not found: ${command}`,
          short: "Not Found",
          detail: "getAllEvents() Was unable to locate any events."
        };
  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "Server Error",
      detail: "getAllEvents() Caught an error during event lookup."
    };
  }
}

async function getSingleEvent(eventID) {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`
      SELECT *
      FROM events AS e INNER JOIN actions AS a ON (a.event_id = e.event_id)
      WHERE e.event_id = ${eventID}
    `;
    console.log(command);
    return command.count !== 0
      ? { ok: true, content: command }
      : {
          ok: false,
          content: `Event ${eventID} not found: ${command}`,
          short: "Not Found",
          detail: `getSingleEvent(${eventID}) Was unable to locate any events.`
        };

  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "Server Error",
      detail: "getSingleEvent() Caught an error during event lookup."
    };
  }
}

async function deleteEvent(eventID) {
  sqlStorage ??= setupSQL();

  return await sqlStorage
    .begin(async (sqlTrans) => {
      // First lets delete from the actions table
      const commandActions = await sqlTrans`
        DELETE FROM actions
        WHERE event_id = ${eventID}
        RETURNING *;
      `;

      if (commandActions.count === 0) {
        throw `Failed to delete actions for: ${eventID}`;
      }

      // Now lets delete the events
      const commandEvents = await sqlTrans`
        DELETE FROM events
        WHERE event_id = ${eventID}
        RETURNING *;
      `;

      if (commandEvents.count === 0) {
        throw `Failed to delete event: ${eventID}`;
      }

      return {
        ok: true,
        content: `Successfully Deleted Event: ${eventID}`
      };
    })
    .catch((err) => {
      const msg =
        typeof err === "string"
          ? err
          : `A generic error occured while Deleting ${eventID}`;
      return { ok: false, content: msg, short: "Server Error", detail: "deleteEvent() Caught an error during event deletion" };
    });
}

module.exports = {
  shutdownSQL,
  getAllEvents,
  getSingleEvent,
  deleteEvent,
};
