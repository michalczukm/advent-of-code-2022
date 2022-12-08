import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { calculateDistance, runPartOne, runPartTwo } from '.';

describe('day 8', () => {
  it('part one should work for sample input', async () => {
    const sampleInput = await (
      await readFile(join(__dirname, './sample-input'))
    ).toString();

    expect(runPartOne(sampleInput)).toBe(21);
  });

  it('part two should work for sample input', async () => {
    const sampleInput = await (
      await readFile(join(__dirname, './sample-input'))
    ).toString();

    expect(runPartTwo(sampleInput)).toBe(8);
  });

  describe('calculateDistance', () => {
    it('', () =>
      expect(calculateDistance([6, 1, 6, 6, 6], 3)).toEqual({
        left: 1,
        right: 1,
      }));

    it('', () =>
      expect(calculateDistance([6, 1, 6, 6, 6], 0)).toEqual({
        left: 0,
        right: 2,
      }));

    it('', () =>
      expect(calculateDistance([6, 1, 6, 6, 6], 1)).toEqual({
        left: 1,
        right: 1,
      }));

    it('', () =>
      expect(calculateDistance([6, 1, 2, 3, 4], 0)).toEqual({
        left: 1,
        right: 4,
      }));

      it('', () =>
      expect(calculateDistance([6, 1, 2, 3, 6], 0)).toEqual({
        left: 1,
        right: 4,
      }));
  });
});
