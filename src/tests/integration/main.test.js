const request = require("supertest");
let app;

jest.setTimeout(30000);

beforeAll(async () => {
  let db_url = process.env.DATABASE_URL;
  // this gives us something like postgres://test-user@localhost:5432/test-db
  // We then need to map these values to where the API server expects,
  let db_url_reg = /postgres:\/\/([\/\S]+)@([\/\S]+):(\d+)\/([\/\S]+)/;
  let db_url_parsed = db_url_reg.exec(db_url);

  // set the parsed URL as proper env
  process.env.DB_HOST = db_url_parsed[2];
  process.env.DB_USER = db_url_parsed[1];
  process.env.DB_DB = db_url_parsed[4];
  process.env.DB_PORT = db_url_parsed[3];

  // Then since we want to make sure we don't initialize the config module, before we have set our values,
  // we will define our own port to use here.
  process.env.PORT = 8080;

  app = require("../../main.js");
});

expect.extend({
  toHaveHTTPCode(req, want) {
    if (req.statusCode === want) {
      return {
        pass: true,
        message: () => "",
      };
    } else {
      return {
        pass: false,
        message: () => `Expected HTTP Status Code: ${want} but got ${req.statusCode}`,
      };
    }
  },
  toBeArray(value) {
    if (Array.isArray(value)) {
      return {
        pass: true,
        message: () => "",
      };
    } else {
      return {
        pass: false,
        message: () => `Expected Array but received: ${this.utils.printReceived(value)}`,
      };
    }
  },
});

describe("Get /", () => {
  test("Should respond with JSON Status Text & Valid Status Code", async () => {
    const res = await request(app).get("/");
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual(
      expect.stringContaining("Server is up and running: ")
    );
    expect(res).toHaveHTTPCode(200);
  });
});

describe("Get /api/events", () => {
  test("Should respond with Valid Status Code", async () => {
    const res = await request(app).get("/api/events");
    expect(res).toHaveHTTPCode(200);
  });
  test("Should respond with a valid Schema", async () => {
    const res = await request(app).get("/api/events");
    expect(res.body).toBeArray();
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('actions');
    expect(res.body[0]).toHaveProperty('event_id');
    expect(typeof res.body[0].name).toEqual("string");
    expect(typeof res.body[0].actions).toEqual("object");
    expect(res.body[0].actions).toBeArray();
    expect(typeof res.body[0].event_id).toEqual("number");
    expect(res.body[0].actions.length).toBeGreaterThan(0);
    expect(res.body[0].actions[0]).toHaveProperty('action_name');
    expect(res.body[0].actions[0]).toHaveProperty('action_id');
    expect(typeof res.body[0].actions[0].action_name).toEqual("string");
    expect(typeof res.body[0].actions[0].action_id).toEqual("number");
  });
});

describe("Get /api/events/:eventID", () => {
  test("Should respond with Valid Status Code", async () => {
    const res = await request(app).get("/api/events/1");
    expect(res).toHaveHTTPCode(200);
  });
  test("Should respond with a valid schema", async () => {
    const res = await request(app).get("/api/events/1");
    expect(res.body).not.toBeArray();
    expect(typeof res.body).toEqual("object");
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('actions');
    expect(res.body).toHaveProperty('event_id');
    expect(typeof res.body.name).toEqual("string");
    expect(typeof res.body.actions).toEqual("object");
    expect(res.body.actions).toBeArray();
    expect(typeof res.body.event_id).toEqual("number");
    expect(res.body.actions.length).toBeGreaterThan(0);
    expect(res.body.actions[0]).toHaveProperty("action_name");
    expect(res.body.actions[0]).toHaveProperty("action_id");
    expect(typeof res.body.actions[0].action_name).toEqual("string");
    expect(typeof res.body.actions[0].action_id).toEqual("number");
  });
  test.failing("Returns 404 Status & Message with Bad Event ID", async () => {
    const res = await request(app).get("/api/events/1234567890");
    expect(res).toHaveHTTPCode(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual("hello");
  })
});
