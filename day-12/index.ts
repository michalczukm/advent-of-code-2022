type Point = {
  x: number;
  y: number;
  value: string;
  numericValue: number;
  isStart: boolean;
  isEnd: boolean;
  minSteps: number;
};

const is = <T>(item: T | undefined): item is T => item !== undefined;

const pointToKey = (point: { x: number; y: number }): string => {
  return `[${point.x},${point.y}]`;
};

const generatePath = (
  pointsMap: Map<string, Point>,
  startingPoint: Point,
  currentPath: Point[],
  permutations: Point[][],
  min: number
): number => {
  currentPath.push(startingPoint);
  const steps = currentPath.length;

  if (startingPoint.minSteps > steps) {
    startingPoint.minSteps = steps;
  } else {
    return min;
  }

  if (startingPoint.isEnd) {
    permutations.push(currentPath);
    if (min > steps) {
      min = steps;
    }
    return min;
  }

  if (min < steps) {
    return min;
  }

  const neighborhoods = [
    ...[-1, 1].map((dx) => ({
      x: startingPoint.x + dx,
      y: startingPoint.y,
    })),
    ...[-1, 1].map((dy) => ({
      x: startingPoint.x,
      y: startingPoint.y + dy,
    })),
  ]
    .map((p) => pointsMap.get(pointToKey(p)))
    .filter(is)
    .filter((p) => !currentPath.includes(p));

  const options = neighborhoods
    .map(pointToKey)
    .map((key) => pointsMap.get(key))
    .filter(is)
    .filter((p) => startingPoint.numericValue - p.numericValue <= 1);

  return Math.min(
    ...options.map((point) =>
      generatePath(pointsMap, point, [...currentPath], permutations, min)
    )
  );
};

export function runPartOne(input: string): number {
  const points: Point[] = input.split('\n').flatMap((line, rowNo) =>
    line
      .split('')
      .filter((item) => item !== ' ')
      .map((item, colNo) => {
        const value = item === 'S' ? 'a' : item === 'E' ? 'z' : item;
        return {
          x: rowNo,
          y: colNo,
          value,
          numericValue: value.charCodeAt(0) - 97,
          isStart: item === 'E',
          isEnd: item === 'S',
          minSteps: Infinity,
        };
      })
  );

  console.time('run part one;');
  const pointsMap = new Map(points.map((point) => [pointToKey(point), point]));
  const min = generatePath(
    pointsMap,
    points.find((p) => p.isStart)!,
    [],
    [],
    Infinity
  );

  console.timeEnd('run part one;');
  return min - 1;
}

export function runPartTwo(input: string): number {
  return 1;
}
