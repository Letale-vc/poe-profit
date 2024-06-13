import type { Stats } from "node:fs";
import * as fsPromises from "node:fs/promises";
import path from "node:path";
import { FileManager } from "./fileManager.js";

jest.mock("fs/promises");
jest.mock("fs");

describe("WorkingWithFile", () => {
    const pathFolder = path.resolve("data");
    const originalFilePath = path.join(pathFolder, "test.json");

    // Видалити тестовий файл після завершення тестів
    afterAll(async () => {
        await fsPromises.unlink(originalFilePath); // Видаляємо тестовий файл
        jest.clearAllMocks();
    });
    const workingWithFile = new FileManager("test.json");

    describe("loadFile", () => {
        it("should load file and parse its contents", async () => {
            const testData = { foo: "bar" };
            jest.spyOn(fsPromises, "readFile").mockResolvedValue(
                JSON.stringify(testData),
            );

            const contents = await workingWithFile.loadFile();
            expect(contents).toBeDefined();
        });
    });

    describe("saveJsonInFile", () => {
        it("should be call function with the correct arguments", () => {
            const writeFileMock = jest
                .spyOn(fsPromises, "writeFile")
                .mockImplementation();
            const testData = [{ foo: "bar" }];
            workingWithFile.saveFile(testData);
            expect(writeFileMock).toHaveBeenCalledWith(
                originalFilePath,
                JSON.stringify(testData, null, 4),
            );
        });
    });

    describe("fileInfo", () => {
        it("should return file information", () => {
            jest.spyOn(fsPromises, "stat").mockResolvedValue({} as Stats);
            const fileInfo = workingWithFile.fileInfo();
            expect(fileInfo).toBeDefined();
        });
    });
});
