import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runPartOne, runPartTwo } from '.';

readFile(join(__dirname, './sample-input')).then((input) => {
  console.log('DAY 9 result, part 1:', runPartOne(input.toString()));
  console.log('DAY 9 result, part 2:', runPartTwo(input.toString()));
});
