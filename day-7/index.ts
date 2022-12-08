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

const cd = (currentNode: FSNode, target: '/' | '..' | string) => {
  switch (target) {
    case '/':
      return currentNode;
    case '..':
      currentNode.parent && (currentNode = currentNode.parent);
      return currentNode;
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
      return currentNode;
    }
  }
};

const readLsDirLine = (currentNode: FSNode, name: string) => {
  currentNode.children.push({
    name,
    type: 'dir',
    children: [],
    parent: currentNode,
  });

  return currentNode;
};

const readLsFileLine = (currentNode: FSNode, name: string, size: number) => {
  currentNode.children.push({
    name,
    type: 'file',
    parent: currentNode,
    size,
  });

  return currentNode;
};

type Command = 'cd' | 'ls';

const processLine = (currentNode: FSNode, line: string): FSNode => {
  const [first, ...rest] = line.split(' ');

  if (first === '$') {
    const [command, ...params] = rest as [Command, string, string];
    if (command === 'cd') {
      return cd(currentNode, params[0]);
    }
    if (command === 'ls') {
      return currentNode;
    }
  }

  if (first === 'dir') {
    return readLsDirLine(currentNode, rest[0]);
  }

  if (typeof +first === 'number') {
    return readLsFileLine(currentNode, rest[0], +first);
  }

  return currentNode;
};

const calculateDirSize = (
  node: FSNode | FSLeaf,
  dirSizes: Record<string, number> = {}
): [number, Record<string, number>] => {
  if (node.type === 'dir') {
    const size = node.children
      .map((child) => calculateDirSize(child, dirSizes))
      .reduce((acc, [size]) => acc + size, 0);

    dirSizes[`${node.name}_${randomUUID()}`] = size;

    return [size, dirSizes];
  } else {
    return [node.size, dirSizes];
  }
};

const calculateDirSizes = (input: string) => {
  const lines = input.split('\n');
  const filesTree: FSNode = {
    type: 'dir',
    name: '/',
    children: [],
  };
  lines.reduce(
    (currentNode, line) => processLine(currentNode, line),
    filesTree
  );

  const [, dirSizes] = calculateDirSize(filesTree);
  return dirSizes;
};

export function runPartOne(input: string): number {
  const dirSizes = calculateDirSizes(input);
  const finalSum = Object.entries(dirSizes).reduce(
    (acc, [_, size]) => (size <= 100000 ? acc + size : acc),
    0
  );

  return finalSum;
}

export function runPartTwo(input: string): number {
  const dirSizes = calculateDirSizes(input);

  const REQUIRED_FREE_SPACE = 30000000;
  const TOTAL_SYSTEM_SPACE = 70000000;
  const TOTAL_USED_SPACE = Object.values(dirSizes).at(-1) || 0;

  const requiredSpace =
    REQUIRED_FREE_SPACE - (TOTAL_SYSTEM_SPACE - TOTAL_USED_SPACE);

  const sizeOfDirToRemove = Object.values(dirSizes)
    .filter((size) => size >= requiredSpace)
    .sort((a, b) => a - b);

  return sizeOfDirToRemove[0];
}
