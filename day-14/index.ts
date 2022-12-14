type Point = { x: number; y: number };
type Rocks = Point[];

const LOG = false;

const pointToKey = (point: { x: number; y: number }): string => {
  return `[${point.x},${point.y}]`;
};

const isSamePoint = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

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
    Math.max(...rocks.map((coordinates) => coordinates.x)) - minX + 20; //1;

  const height = Math.max(...rocks.map((coordinates) => coordinates.y)) - 0 + 5; //1

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
  sand: Point[],
  infiniteFloor: boolean
): Point[] => {
  const obstacles = new Set<string>([...rocksKeys, ...sand].map(pointToKey));
  const abyssBorder =
    Math.max(...rocksKeys.map((r) => r.y)) + (infiniteFloor ? 1 : 0);

  const hasMeetInifiniteFloor = (point: Point) => point.y >= abyssBorder;
  const exitCriteria = (point: Point, isBlocked: boolean): boolean =>
    infiniteFloor ? isBlocked && isSamePoint(point, sandHole) : point.y >= abyssBorder;

  let loop = undefined;
  const sandDrops: Point[] = [];
  let inTheGame = true;
  while (inTheGame && (loop === undefined || loop > 0)) {
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

      const isFloor = infiniteFloor && hasMeetInifiniteFloor(point);

      const isBlockedDown = isFloor || obstacles.has(pointToKey(down));
      const isBlockedLeft = isFloor || obstacles.has(pointToKey(left));
      const isBlockedRight = isFloor || obstacles.has(pointToKey(right));

      const isFullyBlocked = isBlockedDown && isBlockedLeft && isBlockedRight;

      if (exitCriteria(point, isFullyBlocked)) {
        dropping = false;
        inTheGame = false;
        continue;
      }

      if (isFullyBlocked) {
        obstacles.add(pointToKey(point));
        dropping = false;
        continue;
      }

      if (isBlockedLeft && isBlockedDown) {
        point = { ...right };
        continue;
      }

      if (isBlockedDown) {
        point = { ...left };
        // obstacles.add(pointToKey(point));
        continue;
      }

      point = { ...down };
    }
    obstacles.add(pointToKey(point));
    sandDrops.push(point);
  }

  return sandDrops;
};

export function runPartOne(input: string): number {
  const rocks = buildRocks(input);
  const sandHole: Point = { x: 500, y: 0 };

  console.time('part 1');
  const drops = dropSandUnits(rocks, sandHole, [], false);
  console.timeEnd('part 1');

  visualizeMap(rocks, sandHole, drops);

  return drops.length - 1;
}

export function runPartTwo(input: string): number {
  const rocks = buildRocks(input);
  const sandHole: Point = { x: 500, y: 0 };

  console.time('part 2');
  const drops = dropSandUnits(rocks, sandHole, [], true);
  console.timeEnd('part 2');

  visualizeMap(rocks, sandHole, drops);

  return drops.length;
}
