type TreeState = {
  [Key in 'left' | 'top' | 'right' | 'bottom']: {
    visible: boolean;
    distance: number;
  };
};

export const calculateDistance = (
  array: number[],
  refItemIndex: number
): { left: number; right: number } => {
  const refValue = array[refItemIndex];

  const { leftPosition, rightPosition } = array.reduce(
    (acc, item, index) => {
      if (index < refItemIndex) {
        // @ts-ignore
        acc.leftPosition = item >= refValue && array[acc.leftPosition!] != item ? index : acc.leftPosition;
      }

      if (index > refItemIndex) {
        // @ts-ignore
        acc.rightPosition = item >= refValue && array[acc.rightPosition!] != item ? index : acc.rightPosition;
      }

      return acc;
    },
    {
      leftPosition: undefined,
      rightPosition: undefined
    }
  );

  return {
    left: Math.abs(refItemIndex - (leftPosition ?? 0)),
    right: Math.abs(refItemIndex - (rightPosition ?? array.length - 1)),
  };
};

console.log('TEEEST', calculateDistance([6, 1, 6, 6, 6], 4));

const calculateTreeParams = (
  row: number[],
  column: number[],
  treePosition: { pRow: number; pCol: number }
): TreeState => {
  const state = {
    top: {
      visible: true,
      distance: 0,
    },
    left: {
      visible: true,
      distance: 0,
    },
    bottom: {
      visible: true,
      distance: 0,
    },
    right: {
      visible: true,
      distance: 0,
    },
  };

  const treeHeight = row[treePosition.pCol];

  for (let rowNo = 0; rowNo < row.length; rowNo++) {
    const itemInRow = row[rowNo];

    state.left.visible =
      rowNo < treePosition.pCol && state.left.visible
        ? treeHeight > itemInRow
        : state.left.visible;

    state.right.visible =
      rowNo > treePosition.pCol && state.right.visible
        ? treeHeight > itemInRow
        : state.right.visible;
  }

  for (let colNo = 0; colNo < column.length; colNo++) {
    const itemInColumn = column[colNo];

    state.top.visible =
      colNo < treePosition.pRow && state.top.visible
        ? treeHeight > itemInColumn
        : state.top.visible;

    state.bottom.visible =
      colNo > treePosition.pRow && state.bottom.visible
        ? treeHeight > itemInColumn
        : state.bottom.visible;
  }

  const { left, right } = calculateDistance(row, treePosition.pCol);
  state.left.distance = left;
  state.right.distance = right;

  const { left: top, right: bottom } = calculateDistance(
    column,
    treePosition.pRow
  );
  state.top.distance = top;
  state.bottom.distance = bottom;

  return state;
};

const getForestState = (input: string): TreeState[] => {
  const treeMatrix = input
    .split('\n')
    .map((row) => row.split('').map((val) => +val));

  const rows = treeMatrix;
  const cols = treeMatrix[0].map((_, index) =>
    treeMatrix.map((row) => row[index])
  );

  const forestState = [];
  for (let rowNo = 0; rowNo < treeMatrix.length; rowNo++) {
    for (let colNo = 0; colNo < treeMatrix[rowNo].length; colNo++) {
      forestState.push(
        calculateTreeParams(rows[rowNo], cols[colNo], {
          pRow: rowNo,
          pCol: colNo,
        })
      );
    }
  }

  return forestState;
};

export function runPartOne(input: string): number {
  return getForestState(input).reduce(
    (sum, treeState) =>
      Object.values(treeState).some((position) => position.visible)
        ? sum + 1
        : sum,
    0
  );
}

export function runPartTwo(input: string): number {
  const scenicScores = getForestState(input).map((treeState) =>
    Object.values(treeState).reduce(
      (acc, position) => position.distance * acc,
      1
    )
  );

  console.log('scenicScores', scenicScores);

  return Math.max(...scenicScores);
}
