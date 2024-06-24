import type { IFileManager } from "../../interface/IFileManager.js";
import { DataManager } from "./DataManager.js";
import type { DivProfitObject } from "./types/HelpersType.js";

describe("DataManager", () => {
    const fileData: Record<string, DivProfitObject> = {
        test: {
            id: "test",
            itemBuying: {
                tradeLink: "",
                icon: "",
                name: "",
                stackSize: 0,
                listings: 0,
                divineValue: 0,
                chaosValue: 0,
            },
            itemSelling: {
                tradeLink: "",
                icon: "",
                name: "",
                stackSize: 0,
                listings: 0,
                divineValue: 0,
                chaosValue: 0,
            },
            profitPerTradeInChaos: 0,
            profitPerTradeInDivine: 0,
            profitInDivine: 0,
            profitInChaos: 0,
        },
    };
    const fileManager: IFileManager<Record<string, DivProfitObject>> = {
        init: async (_data) => true,
        loadFile: jest.fn().mockResolvedValue(fileData),
        saveFile: jest.fn(),
    };

    let dataManager: DataManager;

    beforeEach(() => {
        dataManager = new DataManager(fileManager);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should get data from file correct after loadData", async () => {
        await dataManager.loadData();
        const result = await dataManager.getData();

        expect(result).toEqual(fileData);
        expect(fileManager.loadFile).toHaveBeenCalled();
    });

    test("should return data from file if cache is empty", async () => {
        const result = await dataManager.getData();

        expect(result).toEqual(fileData);
        expect(fileManager.loadFile).toHaveBeenCalled();
    });

    test("should update data", async () => {
        const updatedData = {
            id: "test",
            itemBuying: {
                tradeLink: "",
                icon: "",
                name: "test1",
                stackSize: 0,
                listings: 0,
                divineValue: 0,
                chaosValue: 0,
            },
            itemSelling: {
                tradeLink: "",
                icon: "",
                name: "test1",
                stackSize: 0,
                listings: 0,
                divineValue: 0,
                chaosValue: 0,
            },
            profitPerTradeInChaos: 0,
            profitPerTradeInDivine: 0,
            profitInDivine: 0,
            profitInChaos: 0,
        };
        const id = "test";
        await dataManager.update(updatedData);
        const data = await dataManager.getData();
        expect(data[id]).toEqual(updatedData);
    });

    test("should add data", async () => {
        const id = "test1_test2";
        const updatedData = {
            id: id,
            itemBuying: {
                tradeLink: "",
                icon: "",
                name: "test1",
                stackSize: 0,
                listings: 0,
                divineValue: 0,
                chaosValue: 0,
            },
            itemSelling: {
                tradeLink: "",
                icon: "",
                name: "test1",
                stackSize: 0,
                listings: 0,
                divineValue: 0,
                chaosValue: 0,
            },
            profitPerTradeInChaos: 0,
            profitPerTradeInDivine: 0,
            profitInDivine: 0,
            profitInChaos: 0,
        };
        await dataManager.update(updatedData);
        const data = await dataManager.getData();
        expect(data).toEqual({ ...fileData, [id]: updatedData });
    });

    test("should remove data", async () => {
        const idToRemove = "test";
        await dataManager.remove(idToRemove);
        const data = await dataManager.getData();
        expect(data[idToRemove]).toBeUndefined();
    });

    test("should dispose and save data to file", async () => {
        await dataManager.loadData();
        await dataManager.dispose();
        jest.spyOn(fileManager, "loadFile").mockResolvedValue(undefined);
        const data = await dataManager.getData();
        expect(data).toEqual({});
        expect(fileManager.saveFile).toHaveBeenCalledWith(fileData);
    });
});
