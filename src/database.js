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
      FROM events
    `;

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

async function getEventByID(id) {
  try {
    sqlStorage ??= setupSQL();

    const command = await sqlStorage`
      SELECT *
      FROM events
      WHERE id = ${id}
    `;

    return command.count !== 0
      ? { ok: true, content: command[0] }
      : {
          ok: false,
          content: `Event For ID: ${id} Not found`,
          short: "Not Found",
          detail: `getEventByID Failed to lookup event ${id}`
        };
  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "Server Error",
      detail: "getEventByID() Caught an error during event lookup"
    };
  }
}

async function setEventByID(id, name, actions) {
  try {
    sqlStorage ??= setupSQL();
    console.log(`${sqlStorage.array(actions)}`);
    const command = await sqlStorage`
      UPDATE events
      SET name = ${name} AND
      SET actions = ${sqlStorage`'{${actions}}'`}
      WHERE id = ${id}
      RETURNING *;
    `;

    return command.count !== 0
      ? { ok: true, content: command[0] }
      : {
          ok: false,
          content: `setEventByID Failed to insert new Data!`,
          short: "Server Error",
          detail: "setEventByID Failed to insert new data."
        };
  } catch(err) {
    return {
      ok: false,
      content: err,
      short: "Server Error",
      detail: "setEventByID() Caught an Error during event write"
    };
  }
}


module.exports = {
  shutdownSQL,
  getAllEvents,
  getEventByID,
  setEventByID,
};
