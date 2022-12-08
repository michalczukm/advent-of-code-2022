const isVisible = (
  row: number[],
  column: number[],
  treePosition: { pRow: number; pCol: number },
  treeHeight: number,
  forestSize: { rows: number; cols: number }
): boolean => {
  const isEdge =
    treePosition.pCol === 0 ||
    treePosition.pCol === forestSize.cols - 1 ||
    treePosition.pRow === 0 ||
    treePosition.pRow === forestSize.rows - 1;

  if (isEdge) {
    return true;
  }

  const visibility = {
    left: true,
    top: true,
    right: true,
    bottom: true,
  };

  for (let rowNo = 0; rowNo < row.length; rowNo++) {
    const itemInRow = row[rowNo];

    if (visibility.left && rowNo < treePosition.pCol) {
      visibility.left = treeHeight > itemInRow;
    }

    if (visibility.right && rowNo > treePosition.pCol) {
      visibility.right = treeHeight > itemInRow;
    }
  }

  for (let colNo = 0; colNo < column.length; colNo++) {
    const itemInColumn = column[colNo];

    if (visibility.top && colNo < treePosition.pRow) {
      visibility.top = treeHeight > itemInColumn;
    }

    if (visibility.bottom && colNo > treePosition.pRow) {
      visibility.bottom = treeHeight > itemInColumn;
    }
  }

  if (Object.values(visibility).some(Boolean)) {
    console.log('Visible item:', treeHeight, treePosition, visibility);
  }

  return Object.values(visibility).some(Boolean);
};

export function runPartOne(input: string) {
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

      isVisible(
        rows[rowNo],
        cols[colNo],
        {
          pRow: rowNo,
          pCol: colNo,
        },
        item,
        forestSize
      )
        ? visibleTreesAmount++
        : undefined;
    }
  }

  return visibleTreesAmount;
}
