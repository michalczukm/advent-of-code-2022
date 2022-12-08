import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runPartOne } from '.';

readFile(join(__dirname, './sample-input')).then((input) => {
  console.log('DAY 8 result, part 1:', runPartOne(input.toString()));
});
