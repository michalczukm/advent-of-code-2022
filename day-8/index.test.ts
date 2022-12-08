import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runPartOne, runPartTwo } from '.';

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
});
