/** @type {import('ts-jest').JestConfigWithTsJest} */


const jest_config = {
    preset: "ts-jest",
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
    collectCoverageFrom: ["./src/**/*"],
};

export default jest_config;
