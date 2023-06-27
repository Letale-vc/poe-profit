import { DELAY_TRADE_SEARCH } from '../config';

export const delay = (seconds = DELAY_TRADE_SEARCH) => {
  const timeInMilliseconds = seconds * 1000;
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeInMilliseconds);
  });
};

export const round = (num: number, decimalPlaces = 0): number => {
  const p = Math.pow(10, decimalPlaces);
  const n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
};
