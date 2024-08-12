import type { Config } from 'jest';

const config: Config = {
    // Your other configuration settings...
    collectCoverage: false,
    preset: "ts-jest",
    testMatch: ["**/?(*.)test.unit.[tj]s?(x)"],
    coverageDirectory: "coverage",
    coverageProvider: "v8",

    // Ensure globals are enabled
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
        }
    },
};

export default config;