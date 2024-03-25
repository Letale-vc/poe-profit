import type { CurrencyType } from "../../Currency/CurrencyNames.js";
import CurrencyPriceFinder from "../../Currency/CurrencyPriceFinder.js";
import { ItemPriceCalculation } from "./PriceCalculation.js";

describe("ItemPriceCalculation", () => {
    let itemPriceCalculation: ItemPriceCalculation;
    const currencyPriceInChaos: Record<CurrencyType, number> = {
        chaos: 1,
        divine: 10,
    };

    beforeEach(() => {
        itemPriceCalculation = new ItemPriceCalculation();
        CurrencyPriceFinder.currencyPrice = currencyPriceInChaos;
    });

    afterEach(() => {
        jest.resetAllMocks();
        CurrencyPriceFinder.currencyPrice = { chaos: 1, divine: 1 };
    });

    // describe("getPricesInChaos", () => {
    //     it("should calculate prices in chaos for single item", () => {
    //         const itemsArray = [
    //             {
    //                 listing: {
    //                     indexed: new Date(),
    //                     price: {
    //                         type: "price",
    //                         amount: 20,
    //                         currency: "divine",
    //                     },
    //                 },
    //             },
    //         ] as PoeSecondResultType[];
    //         const maxStackSize = 1;
    //         const priceMultiplier = 1;

    //         const result = itemPriceCalculation.getPricesInChaos(
    //             itemsArray,
    //             maxStackSize,
    //             priceMultiplier,
    //         );

    //         expect(result).toEqual({
    //             itemPriceInChaos: 200,
    //             fullStackSizeInChaos: 200,
    //         });
    //     });

    //     it("should calculate prices in chaos for multiple items", () => {
    //         const itemsArray = [
    //             {
    //                 id: "123",
    //                 listing: {
    //                     indexed: new Date(),
    //                     price: {
    //                         type: "price",
    //                         amount: 200,
    //                         currency: "divine",
    //                     },
    //                 },
    //             },
    //             {
    //                 id: "456",
    //                 listing: {
    //                     indexed: new Date(),
    //                     price: {
    //                         type: "price",
    //                         amount: 300,
    //                         currency: "divine",
    //                     },
    //                 },
    //             },
    //         ] as PoeSecondResultType[];
    //         const maxStackSize = 1;
    //         const priceMultiplier = 1;

    //         const result = itemPriceCalculation.getPricesInChaos(
    //             itemsArray,
    //             maxStackSize,
    //             priceMultiplier,
    //         );

    //         expect(result).toEqual({
    //             itemPriceInChaos: (500 * 10) / 2,
    //             fullStackSizeInChaos: (500 * 10) / 2,
    //         });
    //     });
    // });

    // describe("calculatePricesInAllCurrencies", () => {
    //     it("should calculate prices in all currencies", () => {
    //         const priceInChaos = 500;
    //         const maxStackSize = 1;

    //         const result =
    //             itemPriceCalculation.calculatePricesInAllCurrencies(
    //                 priceInChaos,
    //             );

    //         expect(result).toEqual({
    //             chaos: 500,
    //             divine: 500 / 10,
    //         });
    //     });

    //     it("should calculate prices in all currencies with custom max stack size", () => {
    //         const priceInChaos = 500;
    //         const maxStackSize = 10;

    //         const result = itemPriceCalculation.(
    //             priceInChaos,
    //             maxStackSize,
    //         );

    //         expect(result).toEqual({
    //             chaos: 500 * 10,
    //             divine: (500 * 10) / 10,
    //         });
    //     });
    // });
});
