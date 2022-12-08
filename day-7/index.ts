import { randomUUID } from 'node:crypto';

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

// const buildAbsolutePath = (node: FSNode)

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

  console.error('WTF?', line);
};

const DIR_SIZES: Record<string, number> = {};

const calculateDirSize = (node: FSNode | FSLeaf): number => {
  if (node.type === 'dir') {
    const size = node.children
      .map(calculateDirSize)
      .reduce((acc, val) => acc + val, 0);
    DIR_SIZES[`${node.name}_${randomUUID()}`] = size;

    return size;
  } else {
    return node.size;
  }
};

export function runPartOne(input: string): number {
  const lines = input.split('\n');

  lines.map(processLine);
  calculateDirSize(FILES_TREE);

  const finalSum = Object.entries(DIR_SIZES).reduce(
    (acc, [_, size]) => (size <= 100000 ? acc + size : acc),
    0
  );

  return finalSum;
}

export function runPartTwo(input: string): number {
  const lines = input.split('\n');

  lines.map(processLine);
  calculateDirSize(FILES_TREE);

  const REQUIRED_FREE_SPACE = 30000000;
  const TOTAL_SYSTEM_SPACE = 70000000;
  const TOTAL_USED_SPACE = Object.values(DIR_SIZES).at(-1) || 0;

  const requiredSpace =
    REQUIRED_FREE_SPACE - (TOTAL_SYSTEM_SPACE - TOTAL_USED_SPACE);

  const sizeOfDirToRemove = Object.values(DIR_SIZES)
    .filter((size) => size >= requiredSpace)
    .sort((a, b) => a - b);

  return sizeOfDirToRemove[0];
}
