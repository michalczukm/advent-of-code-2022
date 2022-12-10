import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { calculateTailPosition, runPartOne, runPartTwo } from '.';

describe('day 9', () => {
  it('part one should work for sample input', async () => {
    const sampleInput = await (
      await readFile(join(__dirname, './sample-input'))
    ).toString();

    expect(runPartOne(sampleInput)).toBe(13);
  });

  it('part two should work for sample input', async () => {
    const sampleInput = await (
      await readFile(join(__dirname, './sample-input'))
    ).toString();

    expect(runPartTwo(sampleInput)).toBe(24933642);
  });
  describe('calculateTailPosition', () => {
    it('start', () => {
      const actual = calculateTailPosition({ x: 0, y: 0 }, { x: 0, y: 0 });
      expect(actual).toEqual({ x: 0, y: 0 });
    });

    it('right hold', () => {
      const actual = calculateTailPosition({ x: 0, y: 0 }, { x: 1, y: 0 });
      expect(actual).toEqual({ x: 0, y: 0 });
    });

    it('right', () => {
      const actual = calculateTailPosition({ x: 0, y: 0 }, { x: 2, y: 0 });
      expect(actual).toEqual({ x: 1, y: 0 });
    });

    it('left', () => {
      const actual = calculateTailPosition({ x: 3, y: 3 }, { x: 1, y: 3 });
      expect(actual).toEqual({ x: 2, y: 3 });
    });

    it('top', () => {
      const actual = calculateTailPosition({ x: 3, y: 3 }, { x: 3, y: 5 });
      expect(actual).toEqual({ x: 3, y: 4 });
    });

    it('down', () => {
      const actual = calculateTailPosition({ x: 3, y: 3 }, { x: 3, y: 1 });
      expect(actual).toEqual({ x: 3, y: 2 });
    });

    it('diagonal hold', () => {
      const actual = calculateTailPosition({ x: 0, y: 0 }, { x: 1, y: 1 });
      expect(actual).toEqual({ x: 0, y: 0 });
    });

    it('diagonal top right', () => {
      const actual = calculateTailPosition({ x: 0, y: 0 }, { x: 1, y: 2 });
      expect(actual).toEqual({ x: 1, y: 1 });
    });

    it('diagonal top left', () => {
      const actual = calculateTailPosition({ x: 3, y: 1 }, { x: 2, y: 3 });
      expect(actual).toEqual({ x: 2, y: 2 });
    });

    it('diagonal down left', () => {
      const actual = calculateTailPosition({ x: 4, y: 5 }, { x: 3, y: 3 });
      expect(actual).toEqual({ x: 3, y: 4 });
    });

    it('diagonal down right', () => {
      const actual = calculateTailPosition({ x: 2, y: 5 }, { x: 3, y: 3 });
      expect(actual).toEqual({ x: 3, y: 4 });
    });
  });
});
