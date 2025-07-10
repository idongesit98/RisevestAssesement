// jest.config.js
module.exports = {
  // 1) Use ts-jest’s default preset
  preset: "ts-jest/presets/default",

  // 2) Run in a Node environment
  testEnvironment: "node",

  // 3) Don’t ever try to run anything in dist/
  modulePathIgnorePatterns: ["<rootDir>/dist/"],

  // 4) Explicitly tell Jest which file extensions to look for
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // 5) Only treat .test.ts/.test.js under /tests
  testMatch: ["<rootDir>/tests/**/*.test.(ts|js)"],

  // 6) Hook ts-jest up for .ts/.tsx → JavaScript on the fly
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
        // isolatedModules: true   // uncomment only if you hit other build errors
      },
    ],
  },

  // 7) (Optional) If you still see import errors, make sure Jest isn’t ignoring some node_module you need:
  // transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
