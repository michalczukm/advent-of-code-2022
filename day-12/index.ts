type Point = {
  x: number;
  y: number;
  value: string;
  numericValue: number;
  isStart: boolean;
  isEnd: boolean;
};

const is = <T>(item: T | undefined): item is T => item !== undefined;

const pointToKey = (point: { x: number; y: number }): string => {
  return `[${point.x},${point.y}]`;
};

const generatePath = (
  pointsMap: Map<string, Point>,
  startingPoint: Point,
  currentPath: Point[],
  permutations: Point[][]
): Point[][] => {
  currentPath.push(startingPoint);

  if(currentPath.length >= 50) {
    return permutations;
  }

  if (startingPoint.isEnd) {
    permutations.push(currentPath);
    return permutations;
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
    .filter((p) => p.x >= 0 && p.y >= 0 && !currentPath.includes(p));

  const options = neighborhoods
    .map(pointToKey)
    .map((key) => pointsMap.get(key))
    .filter(is)
    .filter((p) => p.numericValue - startingPoint.numericValue <= 1);

  return options.flatMap((point) =>
    generatePath(pointsMap, point, [...currentPath], permutations)
  );
};

export function runPartOne(input: string): number {
  const points: Point[] = input.split('\n').flatMap((line, rowNo) =>
    line.split('').filter(item => item !== ' ').map((item, colNo) => {
      const value = item === 'S' ? 'a' : item === 'E' ? 'z' : item;
      return {
        x: rowNo,
        y: colNo,
        value,
        numericValue: value.charCodeAt(0) - 97,
        isStart: item === 'S',
        isEnd: item === 'E',
      };
    })
  );

  const pointsMap = new Map(points.map((point) => [pointToKey(point), point]));
  const paths = generatePath(pointsMap, points.find((p) => p.isStart)!, [], []);

  return Math.min(...paths.map((p) => p.length - 1));
}

export function runPartTwo(input: string): number {
  return 1;
}
