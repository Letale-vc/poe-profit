export const CURRENCY = [
    "divine",
    // "exalted",
    // "awakened-sextant",
    "chaos",
] as const;

export type CurrencyType = (typeof CURRENCY)[number];
