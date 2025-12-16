export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  coveragePathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "modules/**/*.js",
    "config/**/*.js",
    "middleware/**/*.js",
    "!**/node_modules/**",
  ],
  testTimeout: 30000,
};
