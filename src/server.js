const app = require("./main.js");
const { port } = require("./config.js").getConfig();

const serve = app.listen(port, () => {
  console.log(`Student Pass Backend Listening on port ${port}`);
});

process.on("SIGTERM", async () => {
  await exterminate("SIGTERM");
});

process.on("SIGINT", async () => {
  await exterminate("SIGINT");
});
