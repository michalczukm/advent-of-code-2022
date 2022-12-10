type Move = {
  direction: 'L' | 'R' | 'U' | 'D' | 'LD' | 'LU' | 'RD' | 'RU';
};

type Point = { x: number; y: number };

type StateSnapshot = {
  // the move AFTER which we have current head & tail positions
  move?: Move;
  head: Point;
  tail: Point;
};

type GameHistory = [StateSnapshot, ...StateSnapshot[]];

type Command = Move & { steps: number };

const GAME_MAP: GameHistory = [
  {
    move: undefined,
    head: {
      x: 0,
      y: 0,
    },
    tail: {
      x: 0,
      y: 0,
    },
  },
];

const calculateNextPoint = (
  direction: Move['direction'],
  previous: Point
): Point => {
  const moveOperations = {
    L: { x: previous.x - 1, y: previous.y },
    R: { x: previous.x + 1, y: previous.y },
    U: { x: previous.x, y: previous.y + 1 },
    D: { x: previous.x, y: previous.y - 1 },
    LD: { x: previous.x - 1, y: previous.y - 1 },
    LU: { x: previous.x - 1, y: previous.y + 1 },
    RD: { x: previous.x + 1, y: previous.y - 1 },
    RU: { x: previous.x + 1, y: previous.y + 1 },
  } as const;

  return moveOperations[direction];
};

export const calculateTailPosition = (
  previousTail: Point,
  newHead: Point
): Point => {
  const distance = Math.floor(
    Math.sqrt(
      Math.pow(previousTail.x - newHead.x, 2) +
        Math.pow(previousTail.y - newHead.y, 2)
    )
  );

  if (distance <= 1) {
    return previousTail;
  }

  const vector = {
    x: newHead.x - previousTail.x,
    y: newHead.y - previousTail.y,
  };

  // move left
  if (vector.x < 0 && vector.y === 0)
    return calculateNextPoint('L', previousTail);
  // move right
  if (vector.x > 0 && vector.y === 0)
    return calculateNextPoint('R', previousTail);

  // move up
  if (vector.x === 0 && vector.y > 0)
    return calculateNextPoint('U', previousTail);
  // move down
  if (vector.x === 0 && vector.y < 0)
    return calculateNextPoint('D', previousTail);

  // move left up
  if (vector.x < 0 && vector.y > 0)
    return calculateNextPoint('LU', previousTail);
  // move left down
  if (vector.x < 0 && vector.y < 0)
    return calculateNextPoint('LD', previousTail);

  // move right up
  if (vector.x > 0 && vector.y > 0)
    return calculateNextPoint('RU', previousTail);
  // move right down
  if (vector.x > 0 && vector.y < 0)
    return calculateNextPoint('RD', previousTail);

  console.log('distance: ', distance);

  return previousTail;
};

const isSamePoint = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

const visualizeMap = (game: GameHistory) => {
  const width =
    Math.max(5, ...game.flatMap((state) => [state.head.x, state.tail.x])) + 1;
  const height =
    Math.max(4, ...game.flatMap((state) => [state.head.y, state.tail.y])) + 1;

  const xArray = Array.from(Array(width).keys());
  const yArray = Array.from(Array(height).keys());

  // moved by height to start from LEFT BOTTOM corner
  const gamePoint = game.at(-1)!;
  const currentPoint = {
    head: {
      ...gamePoint.head,
      y: -gamePoint.head.y + height - 1,
    },
    tail: {
      ...gamePoint.tail,
      y: -gamePoint.tail.y + height - 1,
    },
  };

  yArray.forEach((y) => {
    xArray.forEach((x) => {
      const printPoint = { x, y };
      if (isSamePoint(printPoint, currentPoint.head)) process.stdout.write('H');
      else if (isSamePoint(printPoint, currentPoint.tail))
        process.stdout.write('T');
      else process.stdout.write('.');
    });
    process.stdout.write('\n');
  });

  console.log('\n');
};

const makeMove = (move: Move) => {
  const state = GAME_MAP.at(-1)!;

  const newHead = calculateNextPoint(move.direction, state.head);
  const newTail = calculateTailPosition(state.tail, newHead);

  GAME_MAP.push({
    head: newHead,
    tail: newTail,
    move,
  });

  visualizeMap(GAME_MAP);
};

const executeCommand = ({ direction, steps }: Command) => {
  console.log(`\n\n== ${direction} ${steps} ==`);

  Array.from(Array(steps)).forEach((_) => makeMove({ direction }));
};

const visualizeInitialStep = (initial: GameHistory) => {
  console.log(`\n\n== INITIAL ==`);
  visualizeMap(initial);
};

const calculateTailVisits = (game: GameHistory): number => {
  const uniquePoints = [
    ...new Map(
      game.map(state => state.tail)
      .map(point => [JSON.stringify(point), point])
    )
    .values()
  ]

  return uniquePoints.length;
}

export function runPartOne(input: string): number {
  const commands = input.split('\n').map((line) => {
    const [direction, steps] = line.split(' ');
    return {
      direction,
      steps: +steps,
    };
  }) as Command[];

  visualizeInitialStep(GAME_MAP);

  commands.forEach(executeCommand);

  return calculateTailVisits(GAME_MAP);
}

export function runPartTwo(input: string): number {
  return 1;
}
