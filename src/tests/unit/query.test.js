const query = require("../../query.js");

const task_tests = [
  [ { query: { task: "add" } }, "add" ],
  [ { query: { task: "remove" } }, "remove" ],
  [ { query: { task: "" } }, "" ],
  [ { query: { task: "NOTVALID" } }, "" ],
  [ { query: { } }, "" ]
];

describe("Test query.task() Returns", () => {
  test.each(task_tests)("Given %o Returns %p", (arg, expectedResult) => {
    expect(query.task(arg)).toBe(expectedResult);
  });
});

const action_tests = [
  [ { query: { action: 1 } }, 1 ],
  [ { query: { action: 123456 } }, 123456 ],
  [ { query: { action: "anystring" } }, "anystring" ],
  [ { query: { action: null } }, "" ],
  [ { query: { } }, "" ]
];

describe("Test query.action() Returns", () => {
  test.each(action_tests)("Given %o Returns %p", (arg, expectedResult) => {
    expect(query.action(arg)).toBe(expectedResult);
  });
});

const eventid_tests = [
  [ { params: { eventID: 1 } }, 1 ],
  [ { params: { eventID: 123456 } }, 123456 ]
];

describe("Test query.eventID() Returns", () => {
  test.each(eventid_tests)("Given %o Returns %p", (arg, expectedResult) => {
    expect(query.eventID(arg)).toBe(expectedResult);
  });
});
