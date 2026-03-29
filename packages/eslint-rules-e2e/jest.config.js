module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  moduleNameMapper: {
    "^@ts-unify/core$": "<rootDir>/../core/src/index.ts",
    "^@ts-unify/eslint$": "<rootDir>/../eslint/src/index.ts",
    "^@ts-unify/rules$": "<rootDir>/../rules/src/index.ts",
    "^@$": "<rootDir>/../core/src/index.ts",
    "^@/(.*)$": "<rootDir>/../core/src/$1",
  },
};
