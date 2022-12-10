type Command = { operation: 'addx' | 'noop'; value: number };

type CycleState = {
  cycleNo: number;
  registerX: number;
  command?: Command;
};

type EventsStateLog = CycleState[];

const executeCommand = (
  command: Command,
  state: EventsStateLog
): EventsStateLog => {
  const lastState = state.at(-1)!;

  const commandToState = {
    // I shouls store here DURING cicle, not after
    addx: () => [
      {
        cycleNo: lastState.cycleNo + 1,
        registerX: lastState.registerX,
        command: {...command, step: '1 of 2'},
      },
      {
        cycleNo: lastState.cycleNo + 2,
        registerX: lastState.registerX + command.value,
        command: {...command, step: '2 of 2'},
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

const registerXAt = (n: number, state: EventsStateLog): number => {
  const signal = state[n - 1];

  console.log(`signal at "${n}": `, signal);

  return signal.registerX;
};

const calculateSignalStrength = (n: number, state: EventsStateLog): number => {
  const strength = registerXAt(n, state) * n;

  console.log(`strength at ${n}: `, strength);

  return strength;
};

const calculateSignalsStrength = (state: EventsStateLog): number => {
  return [20, 60, 100, 140, 180, 220].reduce(
    (sum, n) => sum + calculateSignalStrength(n, state),
    0
  );
};

export function runPartOne(input: string): number {
  const commands = input.split('\n').map((line) => {
    const [operation, value] = line.split(' ');
    return {
      operation,
      value: +value || 0,
    };
  }) as Command[];

  const initialState: EventsStateLog = [
    {
      cycleNo: 0,
      registerX: 1,
      command: undefined,
    },
  ];

  const finalState = commands.reduce(
    (prevState, command) => executeCommand(command, prevState),
    initialState
  );

  console.log('finalState:', finalState.filter(v => v.cycleNo >= 170 && v.cycleNo <= 231));

  return calculateSignalsStrength(finalState);
}

export function runPartTwo(input: string): number {
  return 1;
}
