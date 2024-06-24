import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { FileManager } from "./fileManager.js";

jest.mock("fs/promises");
jest.mock("fs");

describe("FileManager", () => {
    const pathFolder = path.join(process.cwd(), "data");
    const originalFilePath = path.join(pathFolder, "test.json");

    afterAll(async () => {
        if (fs.existsSync(originalFilePath)) {
            await fsPromises.unlink(originalFilePath);
        }
        jest.clearAllMocks();
    });
    beforeAll(() => {
        if (!fs.existsSync(pathFolder)) {
            fs.mkdirSync(pathFolder);
        }
    });
    const fileManager = new FileManager("test.json");

    describe("loadFile", () => {
        it("should load file and parse its contents", async () => {
            const testData = { foo: "bar" };
            jest.spyOn(fsPromises, "readFile").mockResolvedValue(
                JSON.stringify(testData),
            );

            const contents = await fileManager.loadFile();
            expect(contents).toBeDefined();
        });
    });

    describe("saveJsonInFile", () => {
        it("should be call function with the correct arguments", async () => {
            const writeFileMock = jest
                .spyOn(fsPromises, "writeFile")
                .mockImplementation();
            const testData = [{ foo: "bar" }];
            await fileManager.saveFile(testData);
            expect(writeFileMock).toHaveBeenCalledWith(
                originalFilePath,
                JSON.stringify(testData, null, 4),
            );
        });
    });
});
