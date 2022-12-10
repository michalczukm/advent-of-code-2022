import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { runPartOne, runPartTwo } from '.';

describe('day 10', () => {
  it.only('part one should work for sample input', async () => {
    const sampleInput = await (
      await readFile(join(__dirname, './sample-input'))
    ).toString();

    expect(runPartOne(sampleInput)).toBe(13140);
  });

  it('part two should work for sample input', async () => {
    const sampleInput = await (
      await readFile(join(__dirname, './sample-input'))
    ).toString();

    expect(runPartTwo(sampleInput)).toBe(13140);
  });
});
