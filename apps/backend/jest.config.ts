import type { JestConfigWithTsJest } from "ts-jest";
const jest_config: JestConfigWithTsJest = {
    clearMocks: true,
    extensionsToTreatAsEsm: [".ts"],
    testEnvironment: "node",
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transform: {
        "^.+\\.(ts|js)?$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: {
                    verbatimModuleSyntax: false,
                },
            },
        ],
    },
    collectCoverageFrom: ["src/**"],
};

export default jest_config;
