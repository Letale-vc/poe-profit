export const CURRENCY = [
    "divine",
    // "exalted",
    // "awakened-sextant",
    "chaos",
] as const;
export type CurrencyTypes = (typeof CURRENCY)[number];


