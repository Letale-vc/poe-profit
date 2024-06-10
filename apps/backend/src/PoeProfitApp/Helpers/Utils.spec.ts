import { round } from "./utils.js";

describe("round", () => {
    it("should round a number to the specified decimal places", () => {
        expect(round(3.14159, 2)).toBe(3.14);
        expect(round(10.56789, 1)).toBe(10.6);
        expect(round(7.123, 0)).toBe(7);
    });

    it("should round a number to the nearest integer if no decimal places are specified", () => {
        expect(round(3.14159)).toBe(3);
        expect(round(10.56789)).toBe(11);
        expect(round(7.5)).toBe(8);
    });
});
