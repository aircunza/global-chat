module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  //cacheDirectory: '.tmp/jestCache',

  globals: {
    "ts-jest": {
      tsconfig: {
        target: "ES6", // Defines the compilation target
        module: "CommonJS", // Defines the module system (common in Node.js)
        strict: true, // Enables strict type checking
        esModuleInterop: true, // Allows ES module interoperability
        skipLibCheck: true, // Skips type checking of declaration files
        moduleResolution: "node", // Uses Node.js module resolution strategy
        resolveJsonModule: true, // Allows importing JSON files
        baseUrl: "./", // Base URL for module resolution
        paths: {
          "@src/*": ["src/*"], // You can configure path aliases if needed
          "@test/*": ["test/*"], // You can configure path aliases if needed
        },
      },
    },
  },

  moduleFileExtensions: ["ts", "js"], // File extensions that Jest can handle
  //  testMatch: ['**/tests/**/*.e2e.ts',],  // Runs files that match this pattern
  testMatch: [
    "**/?(*.)+(spec|test).ts", // Search files *.spec.ts o *.test.ts
    "**/?(*.)+(e2e).ts", // Search files *.e2e.ts
  ],
};
