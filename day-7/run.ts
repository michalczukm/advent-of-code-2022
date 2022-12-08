import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runPartOne, runPartTwo } from '.';

readFile(join(__dirname, './input')).then((input) =>
  console.log('DAY 7 result:', runPartTwo(input.toString()))
);
