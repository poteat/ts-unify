module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  moduleNameMapper: {
    "^@ts-unify/runner/(.*)$": "<rootDir>/../runner/src/$1",
    "^@ts-unify/eslint/internal$": "<rootDir>/../eslint/src/internal.ts",
    "^@ts-unify/eslint/(.*)$": "<rootDir>/../eslint/src/$1",
    "^@ts-unify/rules/(.*)$": "<rootDir>/../rules/src/$1",
    "^@ts-unify/core/internal$": "<rootDir>/../core/src/internal.ts",
    "^@ts-unify/core$": "<rootDir>/../core/src/index.ts",
    "^@ts-unify/engine$": "<rootDir>/../engine/src/index.ts",
    "^@ts-unify/engine/(.*)$": "<rootDir>/../engine/src/$1",
    "^@ts-unify/runner$": "<rootDir>/../runner/src/index.ts",
    "^@ts-unify/eslint$": "<rootDir>/../eslint/src/index.ts",
    "^@ts-unify/rules$": "<rootDir>/../rules/src/index.ts",
    "^@$": "<rootDir>/../core/src/index.ts",
    "^@/(.*)$": "<rootDir>/../core/src/$1",
  },
};
