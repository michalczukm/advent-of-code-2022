type Point = { x: number; y: number };
type Rocks = Point[];

const LOG = true;

const isSamePoint = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

const pointToKey = (point: { x: number; y: number }): string => {
  return `[${point.x},${point.y}]`;
};

const visualizeMap = (
  rocks: Rocks,
  sandHole: Point,
  sandDrops: Point[]
): void => {
  if (!LOG) {
    return;
  }

  const minX = Math.min(...rocks.map((coordinates) => coordinates.x));
  const width =
    Math.max(...rocks.map((coordinates) => coordinates.x)) - minX + 1;

  const height = Math.max(...rocks.map((coordinates) => coordinates.y)) - 0 + 1;

  const xArray = Array.from(Array(width).keys());
  const yArray = Array.from(Array(height).keys());

  // moved by height to start from LEFT BOTTOM corner
  const normalizeDimensions = (point: Point): Point => ({
    x: point.x - minX,
    y: point.y,
  });

  const displayElements: Record<string, string> = {
    ...Object.fromEntries(
      rocks.map(normalizeDimensions).map((point) => [pointToKey(point), '#'])
    ),
    ...Object.fromEntries(
      sandDrops
        .map(normalizeDimensions)
        .map((point) => [pointToKey(point), 'o'])
    ),
    [pointToKey(normalizeDimensions(sandHole))]: '+',
  };

  const getCharFor = (point: Point): string =>
    displayElements[pointToKey(point)] || '.';

  yArray.forEach((y) => {
    xArray.forEach((x) => process.stdout.write(getCharFor({ x, y })));
    process.stdout.write('\n');
  });

  console.log('\n');
};

const buildRocks = (input: string): Point[] =>
  input
    .split('\n')
    .map((line) =>
      line.split(' -> ').map((coordinates) => {
        const [x, y] = coordinates.split(',');
        return { x: +x, y: +y };
      })
    )
    .flatMap((rockLine) =>
      rockLine.reduce((points, next) => {
        const prev = points.at(-1);
        if (prev) {
          const xLine = next.x - prev.x;
          const yLine = next.y - prev.y;

          return [
            ...points,
            ...(xLine != 0
              ? Array.from(Array(Math.abs(xLine)).keys()).map((x) => ({
                  x: prev.x + x * Math.sign(xLine),
                  y: prev.y,
                }))
              : Array.from(Array(Math.abs(yLine)).keys()).map((y) => ({
                  x: prev.x,
                  y: prev.y + y * Math.sign(yLine),
                }))),
            next,
          ];
        }

        return [...points, next];
      }, [] as Point[])
    );

const dropSandUnits = (
  rocksKeys: Rocks,
  sandHole: Point,
  sand: Point[]
): Point[] => {
  const obstacles = new Set<string>([...rocksKeys, ...sand].map(pointToKey));
  const abyssBorder = Math.max(...rocksKeys.map((r) => r.y));

  let loop = undefined;
  const sandDrops: Point[] = [];
  let inTheGame = true;
  while (inTheGame && (!loop || loop > 0)) {
    loop && loop--;
    let dropping = true;
    let point = { ...sandHole };
    while (dropping) {
      const down = {
        x: point.x,
        y: point.y + 1,
      };

      const left = {
        x: point.x - 1,
        y: point.y + 1,
      };

      const right = {
        x: point.x + 1,
        y: point.y + 1,
      };

      const isBlockedDown = obstacles.has(pointToKey(down));
      const isBlockedLeft = obstacles.has(pointToKey(left));
      const isBlockedRight = obstacles.has(pointToKey(right));

      if (isBlockedDown && isBlockedLeft && isBlockedRight) {
        dropping = false;
        obstacles.add(pointToKey(point));
        continue;
      }

      if (isBlockedLeft && isBlockedDown) {
        point = { ...right };
        obstacles.add(pointToKey(point));
        continue;
      }

      if (isBlockedDown) {
        point = { ...left };
        obstacles.add(pointToKey(point));
        continue;
      }

      point = { ...down };

      if (point.y >= abyssBorder) {
        dropping = false;
        inTheGame = false;
        continue;
      }
    }
    sandDrops.push(point);
  }

  return sandDrops;
};

export function runPartOne(input: string): number {
  const rocks = buildRocks(input);
  const sandHole: Point = { x: 500, y: 0 };

  const drops = dropSandUnits(rocks, sandHole, []);
  visualizeMap(rocks, sandHole, drops);

  return drops.length;
}

export function runPartTwo(input: string): number {
  return 1;
}
