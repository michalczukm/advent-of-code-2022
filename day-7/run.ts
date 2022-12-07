import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { run } from '.';

readFile(join(__dirname, './input')).then((input) =>
  console.log('DAY 7 result:', run(input.toString()))
);
