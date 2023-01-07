const config = {
  collectCoverage: true,
  coverageReporters: ["text", "clover"],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/tests/integration/fixutres/**",
    "<rootDir>/node_modules/**"
  ],
  projects: [
    {
      displayName: "Integration-Tests",
      globalSetup: "<rootDir>/node_modules/@databases/pg-test/jest/globalSetup",
      globalTeardown: "<rootDir>/node_modules/@databases/pg-test/jest/globalTeardown",
      testMatch: ["<rootDir>/src/tests/integration/*.test.js"]
    },
    {
      displayName: "Unit-Tests",
      testMatch: ["<rootDir>/src/tests/unit/*.test.js"]
    },
  ],
};

module.exports = config;
