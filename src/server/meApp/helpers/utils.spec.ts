import { delay, round } from './utils';

describe('delay', () => {
  jest.useFakeTimers();

  it('should delay execution by the specified number of seconds', async () => {
    const seconds = 2;
    const promise = delay(seconds);
    jest.advanceTimersByTime(seconds * 1000);
    await expect(promise).resolves.toBeUndefined();
  });

  jest.setTimeout(10000); // Збільшити максимальне очікування до 10 секунд
  it('should delay execution by the default number of seconds if no argument is provided', async () => {
    const defaultSeconds = 10;
    const promise = delay();
    jest.advanceTimersByTime(defaultSeconds * 1000);
    await expect(promise).resolves.toBeUndefined();
  });
});

describe('round', () => {
  it('should round a number to the specified decimal places', () => {
    expect(round(3.14159, 2)).toBe(3.14);
    expect(round(10.56789, 1)).toBe(10.6);
    expect(round(7.123, 0)).toBe(7);
  });

  it('should round a number to the nearest integer if no decimal places are specified', () => {
    expect(round(3.14159)).toBe(3);
    expect(round(10.56789)).toBe(11);
    expect(round(7.5)).toBe(8);
  });
});
