// import { FileManager } from "../Helpers/WorkingWithFile/WorkingWithFile.js";
// import NinjaApi from "./NinjaApi.js";
// import { NinjaData, type FindItemInNinjaType } from "./NinjaData.js";
// import type { NinjaAllDataType, OverviewCategory } from "./types/helpers.js";

// describe("NinjaData", () => {
//     let ninjaData: NinjaData;
//     let ninjaApiMock: NinjaApi;
//     let fileManagerMock: FileManager<NinjaAllDataType>;

//     beforeEach(() => {
//         jest.resetAllMocks();
//         ninjaApiMock = new NinjaApi();
//         fileManagerMock = new FileManager<NinjaAllDataType>("ninjaData.json", "object");
//         ninjaData = new NinjaData(ninjaApiMock, fileManagerMock);
//     });

//     describe("getData", () => {
//         test("should return the data for the specified key", async () => {
//             const key = "Currency";
//             const data: NinjaAllDataType = { Currency: {} } as NinjaAllDataType;
//             jest.spyOn(fileManagerMock, "loadFile").mockResolvedValue(data);

//             const result = await ninjaData.getKeyData(key);

//             expect(result).toEqual(data[key]);
//         });
//     });

//     describe("findItem currency category", () => {
//         const item = {
//             currencyTypeName: "Mirror of Kalandra",
//             pay: {
//                 id: 0,
//                 league_id: 208,
//                 pay_currency_id: 22,
//                 get_currency_id: 1,
//                 sample_time_utc: "2024-03-09T16:59:12.8947122Z",
//                 count: 193,
//                 value: 0.000006003,
//                 data_point_count: 1,
//                 includes_secondary: true,
//                 listing_count: 800,
//             },
//             receive: {
//                 id: 0,
//                 league_id: 208,
//                 pay_currency_id: 1,
//                 get_currency_id: 22,
//                 sample_time_utc: "2024-03-09T16:59:12.8947122Z",
//                 count: 98,
//                 value: 173550.0,
//                 data_point_count: 1,
//                 includes_secondary: true,
//                 listing_count: 270,
//             },
//             paySparkLine: {
//                 data: [0, 0, 0, 0, 0, 0, 66.58],
//                 totalChange: 66.58,
//             },
//             receiveSparkLine: {
//                 data: [0, 0.0, 0.2, 0.89, 1.68, 1.51, 2.39],
//                 totalChange: 2.39,
//             },
//             chaosEquivalent: 168929.52,
//             lowConfidencePaySparkLine: {
//                 data: [0, 0, 0, 0, 0, 0, 66.58],
//                 totalChange: 66.58,
//             },
//             lowConfidenceReceiveSparkLine: {
//                 data: [0, 0.0, 0.2, 0.89, 1.68, 1.51, 2.39],
//                 totalChange: 2.39,
//             },
//             detailsId: "mirror-of-kalandra",
//         };

//         const currencyDetails = {
//             id: 22,
//             icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lEdXBsaWNhdGUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/7111e35254/CurrencyDuplicate.png",
//             name: "Mirror of Kalandra",
//             tradeId: "mirror",
//         };
//         const data = {
//             Currency: {
//                 currencyDetails: [currencyDetails],
//                 lines: [item],
//             },
//         } as NinjaAllDataType;

//         const itemName = "Mirror of Kalandra";
//         const expected: FindItemInNinjaType = {
//             category: "Currency",
//             icon: currencyDetails.icon,
//             name: item.currencyTypeName,
//             baseType: "",
//             tradeId: currencyDetails.tradeId,
//             detailsId: item.detailsId,
//         };

//         test("should find an item in the ninja data by its name and category", async () => {
//             const categories: OverviewCategory[] = ["Currency"];

//             jest.spyOn(fileManagerMock, "loadFile").mockResolvedValue(data);

//             const result = await ninjaData.findItem(itemName, categories);

//             expect(result).toEqual(expected);
//         });

//         test("should find an item in the ninja data by its name without specifying  categories", async () => {
//             jest.spyOn(fileManagerMock, "loadFile").mockResolvedValue(data);

//             const result = await ninjaData.findItem(itemName);

//             expect(result).toEqual(expected);
//         });
//     });

//     describe("findItem items category", () => {
//         const item = {
//             id: 5045,
//             name: "Voidforge",
//             icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Ud29IYW5kU3dvcmRzL1N0YXJmb3JnZSIsInciOjIsImgiOjQsInNjYWxlIjoxfV0/86b81685e1/Starforge.png",
//             levelRequired: 67,
//             baseType: "Infernal Sword",
//             links: 5,
//             itemClass: 3,
//             sparkline: {
//                 data: [],
//                 totalChange: 0,
//             },
//             lowConfidenceSparkline: {
//                 data: [0, 0.23, 0.18, 0.51, 0.48, -7.82, -13.59],
//                 totalChange: -13.59,
//             },
//             implicitModifiers: [
//                 {
//                     text: "30% increased Elemental Damage with Attack Skills",
//                     optional: false,
//                 },
//             ],
//             explicitModifiers: [
//                 {
//                     text: "(5-8)% increased Attack Speed",
//                     optional: false,
//                 },
//                 {
//                     text: "+(90-100) to maximum Life",
//                     optional: false,
//                 },
//                 {
//                     text: "Your Elemental Damage can Shock",
//                     optional: false,
//                 },
//                 {
//                     text: "Gain 700% of Weapon Physical Damage as Extra Damage of a random Element",
//                     optional: false,
//                 },
//                 {
//                     text: "20% increased Area of Effect for Attacks",
//                     optional: false,
//                 },
//                 {
//                     text: "Deal no Non-Elemental Damage",
//                     optional: false,
//                 },
//             ],
//             flavourText: "A weapon born of nothingness,\ncan only create more nothingness.",
//             itemType: "Two Handed Sword",
//             chaosValue: 15101.6,
//             exaltedValue: 1304.11,
//             divineValue: 102.9,
//             count: 2,
//             detailsId: "voidforge-infernal-sword-5l",
//             tradeInfo: [],
//             listingCount: 8,
//         };
//         const categories: OverviewCategory[] = ["UniqueWeapons"];
//         const itemName = "Voidforge";
//         const data = {
//             UniqueWeapons: {
//                 lines: [
//                     item,
//                     {
//                         id: 5045,
//                         name: "2222",
//                         icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Ud29IYW5kU3dvcmRzL1N0YXJmb3JnZSIsInciOjIsImgiOjQsInNjYWxlIjoxfV0/86b81685e1/Starforge.png",
//                         levelRequired: 67,
//                         baseType: "Infernal Sword",
//                         links: 5,
//                         itemClass: 3,
//                         sparkline: {
//                             data: [],
//                             totalChange: 0,
//                         },
//                         lowConfidenceSparkline: {
//                             data: [0, 0.23, 0.18, 0.51, 0.48, -7.82, -13.59],
//                             totalChange: -13.59,
//                         },
//                         implicitModifiers: [
//                             {
//                                 text: "30% increased Elemental Damage with Attack Skills",
//                                 optional: false,
//                             },
//                         ],
//                         explicitModifiers: [
//                             {
//                                 text: "(5-8)% increased Attack Speed",
//                                 optional: false,
//                             },
//                             {
//                                 text: "+(90-100) to maximum Life",
//                                 optional: false,
//                             },
//                             {
//                                 text: "Your Elemental Damage can Shock",
//                                 optional: false,
//                             },
//                             {
//                                 text: "Gain 700% of Weapon Physical Damage as Extra Damage of a random Element",
//                                 optional: false,
//                             },
//                             {
//                                 text: "20% increased Area of Effect for Attacks",
//                                 optional: false,
//                             },
//                             {
//                                 text: "Deal no Non-Elemental Damage",
//                                 optional: false,
//                             },
//                         ],
//                         flavourText:
//                             "A weapon born of nothingness,\ncan only create more nothingness.",
//                         itemType: "Two Handed Sword",
//                         chaosValue: 15101.6,
//                         exaltedValue: 1304.11,
//                         divineValue: 102.9,
//                         count: 2,
//                         detailsId: "voidforge-infernal-sword-5l",
//                         tradeInfo: [],
//                         listingCount: 8,
//                     },
//                 ],
//             },
//         } as unknown as NinjaAllDataType;
//         const expected: FindItemInNinjaType = {
//             category: "UniqueWeapons",
//             name: item.name,
//             baseType: item.baseType,
//             icon: item.icon,
//             tradeId: undefined,
//             detailsId: item.detailsId,
//         };
//         test("should find an item in the ninja data by its name without specifying  categories", async () => {
//             jest.spyOn(fileManagerMock, "loadFile").mockResolvedValue(data);

//             const result = await ninjaData.findItem(itemName);

//             expect(result).toEqual(expected);
//         });
//         test("should find an item in the ninja data by its name and category", async () => {
//             jest.spyOn(fileManagerMock, "loadFile").mockResolvedValue(data);

//             const result = ninjaData.findItem(itemName, categories);

//             expect(result).toEqual(expected);
//         });

//         test("should return undefined if the item is not found", async () => {
//             jest.spyOn(fileManagerMock, "loadFile").mockResolvedValue(data);

//             const result = ninjaData.findItem("Non-existent Item");

//             expect(result).toBeUndefined();
//         });
//     });
// });
