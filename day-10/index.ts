type Command = { operation: 'addx' | 'noop'; value: number };

type CycleState = {
  cycleNo: number;
  registerX: number;
  command?: Command;
};

type CpuInstructions = CycleState[];

const executeCommand = (
  command: Command,
  state: CpuInstructions
): CpuInstructions => {
  const lastState = state.at(-1)!;

  const commandToState = {
    // I should store here DURING cycle, not after. But on well. 2 hacks due to that :badpockerface:
    addx: () => [
      {
        cycleNo: lastState.cycleNo + 1,
        registerX: lastState.registerX,
        command: { ...command, step: '1 of 2' },
      },
      {
        cycleNo: lastState.cycleNo + 2,
        registerX: lastState.registerX + command.value,
        command: { ...command, step: '2 of 2' },
      },
    ],
    noop: () => [
      {
        cycleNo: lastState.cycleNo + 1,
        registerX: lastState.registerX,
        command,
      },
    ],
  };

  return [...state, ...commandToState[command.operation]()];
};

const registerXAt = (n: number, state: CpuInstructions): number =>
  state[n - 1].registerX;

const calculateSignalStrength = (n: number, state: CpuInstructions): number =>
  registerXAt(n, state) * n;

const calculateSignalsStrength = (state: CpuInstructions): number => {
  return [20, 60, 100, 140, 180, 220].reduce(
    (sum, n) => sum + calculateSignalStrength(n, state),
    0
  );
};

const execute = (input: string): CpuInstructions => {
  const commands = input.split('\n').map((line) => {
    const [operation, value] = line.split(' ');
    return {
      operation,
      value: +value || 0,
    };
  }) as Command[];

  const initialState: CpuInstructions = [
    {
      cycleNo: 0,
      registerX: 1,
      command: undefined,
    },
  ];

  return commands.reduce(
    (prevState, command) => executeCommand(command, prevState),
    initialState
  );
};

export function runPartOne(input: string): number {
  return calculateSignalsStrength(execute(input));
}

const displayImage = (state: CycleState[]): void => {
  const getCharForCRT = (crtPosition: number, xPosition: number): '#' | '.' => {
    return isSpriteVisible(xPosition, crtPosition) ? '#' : '.';
  };

  console.log('\n');

  state.forEach((cycle, index) => {
    if (index === 0) {
      return;
    }
    process.stdout.write(
      getCharForCRT((index - 1) % 40, state[index - 1].registerX)
    );
    if (cycle.cycleNo % 40 === 0) {
      process.stdout.write('\n');
    }
  });

  console.log('\n');
};

const isSpriteVisible = (
  xPosition: number,
  currentCrtPosition: number
): boolean => {
  return [xPosition - 1, xPosition, xPosition + 1].includes(currentCrtPosition);
};

export function runPartTwo(input: string): number {
  displayImage(execute(input));

  return 1;
}
