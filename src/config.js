
function getConfigFile() {

}

function getConfig() {
  // Should follow the format of the pulsar package-backend

  return {
    port: "8080",
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_DB: process.env.DB_DB,
    DB_PORT: process.env.DB_PORT,
    DB_SSL_CERT: process.env.DB_SSL_CERT
  };

}

module.exports = {
  getConfig,
};
