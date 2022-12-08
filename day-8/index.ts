import { stat } from 'node:fs';

type TreeState = {
  [Key in 'left' | 'top' | 'right' | 'bottom']: {
    visible: boolean;
    distance: number;
  };
};

const treeParams = (
  row: number[],
  column: number[],
  treePosition: { pRow: number; pCol: number },
  treeHeight: number,
  forestSize: { rows: number; cols: number }
): TreeState => {
  // const isEdge =
  //   treePosition.pCol === 0 ||
  //   treePosition.pCol === forestSize.cols - 1 ||
  //   treePosition.pRow === 0 ||
  //   treePosition.pRow === forestSize.rows - 1;

  // if (isEdge) {
  //   return true;
  // }

  const state = {
    left: {
      visible: true,
      distance: 0,
    },
    top: {
      visible: true,
      distance: 0,
    },
    right: {
      visible: true,
      distance: 0,
    },
    bottom: {
      visible: true,
      distance: 0,
    },
  };

  for (let rowNo = 0; rowNo < row.length; rowNo++) {
    const itemInRow = row[rowNo];

    if (treePosition.pCol === 0) {
      state.left.visible = true;
    }

    if (treePosition.pCol === forestSize.cols - 1) {
      state.right.visible = true;
    }

    if (rowNo < treePosition.pCol) {
      state.left.visible = state.left.visible
        ? treeHeight > itemInRow
        : state.left.visible;
    }

    if (rowNo > treePosition.pCol) {
      state.right.visible = state.right.visible
        ? treeHeight > itemInRow
        : state.right.visible;
    }
  }

  for (let colNo = 0; colNo < column.length; colNo++) {
    const itemInColumn = column[colNo];

    if (treePosition.pRow === 0) {
      state.top.visible = true;
    }

    if (treePosition.pRow === forestSize.rows - 1) {
      state.bottom.visible = true;
    }

    if (colNo < treePosition.pRow) {
      state.top.visible = state.top.visible
        ? treeHeight > itemInColumn
        : state.top.visible;
    }

    if (colNo > treePosition.pRow) {
      state.bottom.visible = state.bottom.visible
        ? treeHeight > itemInColumn
        : state.bottom.visible;
    }
  }

  return state;
};

export function runPartOne(input: string): number {
  const treeMatrix = input
    .split('\n')
    .map((row) => row.split('').map((val) => +val));

  const forestSize = {
    rows: treeMatrix.length,
    cols: treeMatrix[0].length,
  };

  const rows = treeMatrix;
  const cols = treeMatrix[0].map((_, index) =>
    treeMatrix.map((row) => row[index])
  );

  let visibleTreesAmount = 0;
  for (let rowNo = 0; rowNo < treeMatrix.length; rowNo++) {
    for (let colNo = 0; colNo < treeMatrix[rowNo].length; colNo++) {
      const item = treeMatrix[rowNo][colNo];

      Object.values(
        treeParams(
          rows[rowNo],
          cols[colNo],
          {
            pRow: rowNo,
            pCol: colNo,
          },
          item,
          forestSize
        )
      ).some((position) => position.visible)
        ? visibleTreesAmount++
        : undefined;
    }
  }

  return visibleTreesAmount;
}

export function runPartTwo(input: string): number {
  return 5;
}
