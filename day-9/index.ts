type Move = {
  direction: 'L' | 'R' | 'U' | 'D';
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

const calculateNextPoint = (move: Move, previous: Point): Point => {
  const moveOperations = {
    L: { x: previous.x - 1, y: previous.y },
    R: { x: previous.x + 1, y: previous.y },
    U: { x: previous.x, y: previous.y + 1 },
    D: { x: previous.x, y: previous.y - 1 },
  } as const;

  return moveOperations[move.direction];
};

const calculateTailPosition = (previousTail: Point, newHead: Point): Point => {
  // FOR NOW
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
      y: - gamePoint.head.y + height - 1,
    },
    tail: {
      ...gamePoint.tail,
      y: - gamePoint.tail.y + height - 1,
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

  const newHead = calculateNextPoint(move, state.head);
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

export function runPartOne(input: string): number {
  const commands = input.split('\n').map((line) => {
    const [direction, steps] = line.split(' ');
    return {
      direction,
      steps: +steps,
    };
  }) as Command[];

  visualizeInitialStep(GAME_MAP);

  [commands[0], commands[1]].forEach(executeCommand);

  return 1;
}

export function runPartTwo(input: string): number {
  return 1;
}
