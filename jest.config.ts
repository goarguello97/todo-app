import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/config/env.ts"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
};

export default config;
