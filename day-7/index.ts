import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { serialize } from '@ungap/structured-clone';

const jsonToString = (json: Object): string => {
  const options = { json: true, lossy: true };
  return JSON.stringify(serialize(json, options), null, 2);
};

type FSNode = {
  type: 'dir';
  name: string;
  children: (FSNode | FSLeaf)[];
  parent?: FSNode;
};

type FSLeaf = {
  type: 'file';
  size: number;
  name: string;
  parent: FSNode;
};

const isFSNode = (item: FSNode | FSLeaf): item is FSNode => item.type === 'dir';

const FILES_TREE: FSNode = {
  type: 'dir',
  name: '/',
  children: [],
};

let currentNode: FSNode = FILES_TREE;

const cd = (target: '/' | '..' | string) => {
  switch (target) {
    case '/':
      return;
    case '..':
      currentNode.parent && (currentNode = currentNode.parent);
      return;
    default: {
      const matchedChild = currentNode.children
        .filter(isFSNode)
        .find((child) => child.name === target);

      matchedChild
        ? (currentNode = matchedChild)
        : currentNode.children.push({
            name: target,
            type: 'dir',
            parent: currentNode,
            children: [],
          });
      return;
    }
  }
};

const ls = (lsParams: string[]) => {
  const [dirOr] = lsParams;
};

const readLsDirLine = (name: string) => {
  currentNode.children.push({
    name,
    type: 'dir',
    children: [],
    parent: currentNode,
  });
};

const readLsFileLine = (name: string, size: number) => {
  currentNode.children.push({
    name,
    type: 'file',
    parent: currentNode,
    size,
  });
};

type Command = 'cd' | 'ls';

const processLine = (line: string) => {
  const [first, ...rest] = line.split(' ');

  if (first === '$') {
    const [command, ...params] = rest as [Command, string, string];
    if (command === 'cd') {
      cd(params[0]);
      return;
    }
    if (command === 'ls') {
      return;
    }
  }

  if (first === 'dir') {
    readLsDirLine(rest[0]);
    return;
  }

  if (typeof +first === 'number') {
    readLsFileLine(rest[0], +first);
    return;
  }
};

type DirSize = {
  size: number;
  name: string;
};

const DIR_SIZES: Record<string, number> = {};

const calculateDirSize = (node: FSNode | FSLeaf): number => {
  if (node.type === 'dir') {
    const size = node.children
      .map(calculateDirSize)
      .reduce((acc, val) => acc + val);
      
    DIR_SIZES[node.name] = size;

    return size;
  } else {
    return node.size;
  }
};

export function run(input: string): number {
  const lines = input.split('\n');

  lines.map(processLine);
  calculateDirSize(FILES_TREE);

  const finalSum = Object.entries(DIR_SIZES).reduce(
    (acc, [_, size]) => (size <= 100000 ? acc + size : acc),
    0
  );

    console.dir(DIR_SIZES)

  return finalSum;
}

readFile(join(__dirname, './input')).then((input) =>
  console.log('Day 7 result:', run(input.toString()))
);
