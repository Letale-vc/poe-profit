// import { FileManager } from "../../Helpers/WorkingWithFile/WorkingWithFile.js";
// import NinjaApi from "../../NinjaData/NinjaApi.js";
// import { NinjaData } from "../../NinjaData/NinjaData.js";
// import type { NinjaAllDataType } from "../../NinjaData/types/helpers.js";
// import { ProfitableCardFinder } from "./ProfitableDivinationFinder.js";
// const ninjaData = {
//     Currency: {
//         currencyDetails: [
//             {
//                 id: 81,
//                 icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvTWlycm9yU2hhcmQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/6604b7aa32/MirrorShard.png",
//                 name: "Mirror Shard",
//             },
//         ],
//         lines: [
//             {
//                 currencyTypeName: "Mirror Shard",
//                 pay: {
//                     id: 0,
//                     league_id: 208,
//                     pay_currency_id: 81,
//                     get_currency_id: 1,
//                     sample_time_utc: "2024-03-23T17:15:08.9637456Z",
//                     count: 14,
//                     value: 0.00009801875,
//                     data_point_count: 1,
//                     includes_secondary: true,
//                     listing_count: 68,
//                 },
//                 receive: {
//                     id: 0,
//                     league_id: 208,
//                     pay_currency_id: 1,
//                     get_currency_id: 81,
//                     sample_time_utc: "2024-03-23T17:15:08.9637456Z",
//                     count: 59,
//                     value: 9920,
//                     data_point_count: 1,
//                     includes_secondary: true,
//                     listing_count: 344,
//                 },
//                 paySparkLine: {
//                     data: [0, 0, 0, 0, 0, 10, 12.22],
//                     totalChange: 12.22,
//                 },
//                 receiveSparkLine: {
//                     data: [0, 0, -0.16, 0, 0, 4.49, 6.67],
//                     totalChange: 6.67,
//                 },
//                 chaosEquivalent: 9974.11,
//                 lowConfidencePaySparkLine: {
//                     data: [0, 0, 0, 0, 0, 10, 12.22],
//                     totalChange: 12.22,
//                 },
//                 lowConfidenceReceiveSparkLine: {
//                     data: [0, 0, -0.16, 0, 0, 4.49, 6.67],
//                     totalChange: 6.67,
//                 },
//                 detailsId: "mirror-shard",
//             },
//         ],
//     },
//     DivinationCard: {
//         lines: [
//             {
//                 id: 44612,
//                 name: "Unrequited Love",
//                 icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvRGl2aW5hdGlvbi9JbnZlbnRvcnlJY29uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/f34bf8cbb5/InventoryIcon.png",
//                 baseType: "Unrequited Love",
//                 stackSize: 16,
//                 artFilename: "UnrequitedLove",
//                 itemClass: 6,
//                 sparkline: {
//                     data: [0, -3.33, 0, 0, 0, 3.28, 5.73],
//                     totalChange: 5.73,
//                 },
//                 lowConfidenceSparkline: {
//                     data: [0, -3.33, 0, 0, 0, 3.28, 5.73],
//                     totalChange: 5.73,
//                 },
//                 implicitModifiers: [],
//                 explicitModifiers: [
//                     {
//                         text: "<currencyitem>{19x Mirror Shard}",
//                         optional: false,
//                     },
//                 ],
//                 flavourText:
//                     "<size:26>{The pale flame of his heart disappeared in his azure reflection.\nThe work of a life.\nAmbitious, and unfinished.}",
//                 chaosValue: 14268.6,
//                 exaltedValue: 1361.51,
//                 divineValue: 90,
//                 count: 52,
//                 detailsId: "unrequited-love",
//                 tradeInfo: [],
//                 listingCount: 174,
//             },
//         ],
//     },
// } as unknown as NinjaAllDataType;
// describe("ProfitableCardFinder", () => {
//     let profitableCardFinder: ProfitableCardFinder;
//     let ninjaDataMock: NinjaData;
//     let ninjaApiMock: NinjaApi;
//     let fileManagerMock: FileManager<NinjaAllDataType>;
//     beforeEach(() => {
//         ninjaApiMock = new NinjaApi();
//         fileManagerMock = new FileManager("test-ninjaData.json", "object");
//         ninjaDataMock = new NinjaData(ninjaApiMock, fileManagerMock);
//         profitableCardFinder = new ProfitableCardFinder(ninjaDataMock);
//     });
// });
