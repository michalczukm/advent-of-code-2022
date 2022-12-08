import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runPartOne, runPartTwo } from '.';

readFile(join(__dirname, './input')).then((input) => {
  console.log('DAY 8 result, part 1:', runPartOne(input.toString()));
  console.log('DAY 8 result, part 2:', runPartTwo(input.toString()));
});
