import { PoeTradeFetch } from "poe-trade-fetch";
import { round } from "../Helpers/Utils.js";
import { CURRENCY } from "./CurrencyNames.js";
import CurrencyPriceFinder from "./CurrencyPriceFinder.js";

describe("Currency", () => {
    let currency: CurrencyPriceFinder;
    let poeApiMock: PoeTradeFetch;
    beforeEach(() => {
        // Initialize Currency instance with mock dependencies
        poeApiMock = new PoeTradeFetch({ userAgent: "TEST" });
        jest.spyOn(poeApiMock, "exchangeRequest").mockImplementation();
        currency = new CurrencyPriceFinder(poeApiMock);
    });

    test("should initialize currencyPrice with default values", () => {
        for (const val of CURRENCY) {
            expect(CurrencyPriceFinder.currencyPrice[val]).toBe(1);
        }
    });

    test("should update currency prices", async () => {
        // Mock search result for each currency
        const searchResult = {
            id: "9z28fK",
            complexity: null,
            result: {
                "2e5339740f7d40cee3161c118894abcc810f17d6b49b6d4ce39e8e12e85d535e":
                    {
                        id: "2e5339740f7d40cee3161c118894abcc810f17d6b49b6d4ce39e8e12e85d535e",
                        item: null,
                        listing: {
                            indexed: "2023-10-30T18:26:56+00:00",
                            account: {
                                name: "ZeromuS1",
                                online: {
                                    league: "Ancestor",
                                },
                                lastCharacterName: "zZeromuSs",
                                language: "en_US",
                                realm: "pc",
                            },
                            offers: [
                                {
                                    exchange: {
                                        currency: "chaos",
                                        amount: 1200,
                                        whisper: "{0} Chaos Orb",
                                    },
                                    item: {
                                        currency: "divine",
                                        amount: 5,
                                        stock: 616,
                                        id: "2e5339740f7d40cee3161c118894abcc810f17d6b49b6d4ce39e8e12e85d535e",
                                        whisper: "{0} Divine Orb",
                                    },
                                },
                            ],
                            whisper:
                                "@zZeromuSs Hi, I'd like to buy your {0} for my {1} in Ancestor",
                            whisper_token:
                                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjMTI1ZjQzYjU5NjM2ODY2ZjI2NTRjYTJkMWJjNzQzZSIsImlzcyI6Ijl6MjhmSyIsImF1ZCI6IjQ2MThkNWM4LWYyMmEtNDVhNi04NTg2LTAxYzE0MjY5YmVkNiIsImRzdCI6InpaZXJvbXVTcyIsImxvYyI6ImVuX1VTIiwidG9rIjoiZXhjaGFuZ2UiLCJzdWIiOiIyZTUzMzk3NDBmN2Q0MGNlZTMxNjFjMTE4ODk0YWJjYzgxMGYxN2Q2YjQ5YjZkNGNlMzllOGUxMmU4NWQ1MzVlIiwiZGF0IjpbeyJleGNoYW5nZSI6eyJjdXJyZW5jeSI6ImNoYW9zIiwiYW1vdW50IjoxMjAwfSwiaXRlbSI6eyJjdXJyZW5jeSI6ImRpdmluZSIsImFtb3VudCI6NSwic3RvY2siOjYxNiwiaWQiOiIyZTUzMzk3NDBmN2Q0MGNlZTMxNjFjMTE4ODk0YWJjYzgxMGYxN2Q2YjQ5YjZkNGNlMzllOGUxMmU4NWQ1MzVlIn19XSwiaWF0IjoxNjk4NjkwNDMwLCJleHAiOjE2OTg2OTA3MzB9.4ZT8Mph_bTomylsSgAdcRAyBaC6wL9ZYbe3yl2nQpx0",
                        },
                    },
                "8402e651f65464309e0e61482d3a3c3343b39f7ad2e227da533ae25722cdfdca":
                    {
                        id: "8402e651f65464309e0e61482d3a3c3343b39f7ad2e227da533ae25722cdfdca",
                        item: null,
                        listing: {
                            indexed: "2023-10-30T18:23:12+00:00",
                            account: {
                                name: "Reqkn",
                                online: {
                                    league: "Ancestor",
                                },
                                lastCharacterName: "Savitar",
                                language: "en_US",
                                realm: "pc",
                            },
                            offers: [
                                {
                                    exchange: {
                                        currency: "chaos",
                                        amount: 3600,
                                        whisper: "{0} Chaos Orb",
                                    },
                                    item: {
                                        currency: "divine",
                                        amount: 15,
                                        stock: 15,
                                        id: "8402e651f65464309e0e61482d3a3c3343b39f7ad2e227da533ae25722cdfdca",
                                        whisper: "{0} Divine Orb",
                                    },
                                },
                            ],
                            whisper:
                                "@Savitar Hi, I'd like to buy your {0} for my {1} in Ancestor",
                            whisper_token:
                                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjMTI1ZjQzYjU5NjM2ODY2ZjI2NTRjYTJkMWJjNzQzZSIsImlzcyI6Ijl6MjhmSyIsImF1ZCI6IjQ2MThkNWM4LWYyMmEtNDVhNi04NTg2LTAxYzE0MjY5YmVkNiIsImRzdCI6IlNhdml0YXIiLCJsb2MiOiJlbl9VUyIsInRvayI6ImV4Y2hhbmdlIiwic3ViIjoiODQwMmU2NTFmNjU0NjQzMDllMGU2MTQ4MmQzYTNjMzM0M2IzOWY3YWQyZTIyN2RhNTMzYWUyNTcyMmNkZmRjYSIsImRhdCI6W3siZXhjaGFuZ2UiOnsiY3VycmVuY3kiOiJjaGFvcyIsImFtb3VudCI6MzYwMH0sIml0ZW0iOnsiY3VycmVuY3kiOiJkaXZpbmUiLCJhbW91bnQiOjE1LCJzdG9jayI6MTUsImlkIjoiODQwMmU2NTFmNjU0NjQzMDllMGU2MTQ4MmQzYTNjMzM0M2IzOWY3YWQyZTIyN2RhNTMzYWUyNTcyMmNkZmRjYSJ9fV0sImlhdCI6MTY5ODY5MDQzMCwiZXhwIjoxNjk4NjkwNzMwfQ.O3Sef95Am3HFh3_euJPhdA0UHfN23VQnXWfngsiPd3k",
                        },
                    },
                "23f5fc712d3b5e448faeae553613fa2c2edb2448e737331779ac94b269b70fa7":
                    {
                        id: "23f5fc712d3b5e448faeae553613fa2c2edb2448e737331779ac94b269b70fa7",
                        item: null,
                        listing: {
                            indexed: "2023-10-30T18:26:16+00:00",
                            account: {
                                name: "LordsOfRage",
                                online: {
                                    league: "Ancestor",
                                },
                                lastCharacterName: "LordofRage_Trial",
                                language: "en_US",
                                realm: "pc",
                            },
                            offers: [
                                {
                                    exchange: {
                                        currency: "chaos",
                                        amount: 240,
                                        whisper: "{0} Chaos Orb",
                                    },
                                    item: {
                                        currency: "divine",
                                        amount: 1,
                                        stock: 1,
                                        id: "23f5fc712d3b5e448faeae553613fa2c2edb2448e737331779ac94b269b70fa7",
                                        whisper: "{0} Divine Orb",
                                    },
                                },
                            ],
                            whisper:
                                "@LordofRage_Trial Hi, I'd like to buy your {0} for my {1} in Ancestor",
                            whisper_token:
                                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjMTI1ZjQzYjU5NjM2ODY2ZjI2NTRjYTJkMWJjNzQzZSIsImlzcyI6Ijl6MjhmSyIsImF1ZCI6IjQ2MThkNWM4LWYyMmEtNDVhNi04NTg2LTAxYzE0MjY5YmVkNiIsImRzdCI6IkxvcmRvZlJhZ2VfVHJpYWwiLCJsb2MiOiJlbl9VUyIsInRvayI6ImV4Y2hhbmdlIiwic3ViIjoiMjNmNWZjNzEyZDNiNWU0NDhmYWVhZTU1MzYxM2ZhMmMyZWRiMjQ0OGU3MzczMzE3NzlhYzk0YjI2OWI3MGZhNyIsImRhdCI6W3siZXhjaGFuZ2UiOnsiY3VycmVuY3kiOiJjaGFvcyIsImFtb3VudCI6MjQwfSwiaXRlbSI6eyJjdXJyZW5jeSI6ImRpdmluZSIsImFtb3VudCI6MSwic3RvY2siOjEsImlkIjoiMjNmNWZjNzEyZDNiNWU0NDhmYWVhZTU1MzYxM2ZhMmMyZWRiMjQ0OGU3MzczMzE3NzlhYzk0YjI2OWI3MGZhNyJ9fV0sImlhdCI6MTY5ODY5MDQzMCwiZXhwIjoxNjk4NjkwNzMwfQ.aANOnlIj--6fMZc_cLzg2zq5lOZ7PZCs98Jam3P-fAM",
                        },
                    },
            },
            total: 0,
        };

        // Mock makeARequestToAnyItem function to return the search result
        jest.spyOn(poeApiMock, "exchangeRequest").mockResolvedValue(
            searchResult,
        );
        // Update currency prices
        await currency.update();
        // Assert that currency prices have been updated correctly
        expect(CurrencyPriceFinder.currencyPrice.divine).toBe(
            round(1200 / 5, 0),
        );
        // Assert other currency prices have been updated correctly
    });
});
