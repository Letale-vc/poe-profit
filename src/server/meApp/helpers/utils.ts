import { DELAY_TRADE_SEARCH } from '../config';

export const delay = (seconds = DELAY_TRADE_SEARCH) => {
  const timeInMilliseconds = seconds * 1000;
  return new Promise((resolve) => {
    setTimeout(resolve, timeInMilliseconds);
  });
};

export function round(num: number, decimalPlaces = 0): number {
  const p = Math.pow(10, decimalPlaces);
  const n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
}
