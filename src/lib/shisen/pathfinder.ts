import type { BoardMatrix, MatchPair, Position, TileValue } from "./types";

const DIRECTIONS: Array<readonly [number, number]> = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const MAX_TURNS = 2;

const isSamePosition = (a: Position, b: Position) => a.row === b.row && a.col === b.col;

const isInside = (board: BoardMatrix, { row, col }: Position) =>
  row >= 0 && row < board.length && col >= 0 && col < (board[0]?.length ?? 0);

const isStraightLineClear = (board: BoardMatrix, from: Position, to: Position) => {
  if (from.row === to.row) {
    const row = from.row;
    const start = Math.min(from.col, to.col) + 1;
    const end = Math.max(from.col, to.col);
    for (let col = start; col < end; col += 1) {
      if (board[row][col] !== null) {
        return false;
      }
    }
    return true;
  }

  if (from.col === to.col) {
    const col = from.col;
    const start = Math.min(from.row, to.row) + 1;
    const end = Math.max(from.row, to.row);
    for (let row = start; row < end; row += 1) {
      if (board[row][col] !== null) {
        return false;
      }
    }
    return true;
  }

  return false;
};

const isVacant = (board: BoardMatrix, position: Position, target: Position, origin: Position) => {
  if (!isInside(board, position)) {
    return false;
  }

  if (isSamePosition(position, target) || isSamePosition(position, origin)) {
    return true;
  }

  return board[position.row][position.col] === null;
};

const canConnectWithSingleTurn = (
  board: BoardMatrix,
  from: Position,
  to: Position,
) => {
  const pivotA: Position = { row: from.row, col: to.col };
  const pivotB: Position = { row: to.row, col: from.col };

  if (
    isVacant(board, pivotA, to, from) &&
    isStraightLineClear(board, from, pivotA) &&
    isStraightLineClear(board, pivotA, to)
  ) {
    return true;
  }

  if (
    isVacant(board, pivotB, to, from) &&
    isStraightLineClear(board, from, pivotB) &&
    isStraightLineClear(board, pivotB, to)
  ) {
    return true;
  }

  return false;
};

const createPaddedGrid = (board: BoardMatrix): TileValue[][] => {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const padded: TileValue[][] = Array.from({ length: rows + 2 }, () =>
    Array<TileValue>(cols + 2).fill(null),
  );

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      padded[row + 1][col + 1] = board[row][col];
    }
  }

  return padded;
};

const canConnectWithDoubleTurn = (board: BoardMatrix, from: Position, to: Position) => {
  const padded = createPaddedGrid(board);
  const start: Position = { row: from.row + 1, col: from.col + 1 };
  const target: Position = { row: to.row + 1, col: to.col + 1 };

  padded[start.row][start.col] = null;
  padded[target.row][target.col] = null;

  const rows = padded.length;
  const cols = padded[0]?.length ?? 0;

  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Array<number>(DIRECTIONS.length).fill(MAX_TURNS + 1)),
  );

  type Node = { row: number; col: number; dir: number; turns: number };

  const queue: Node[] = [{ row: start.row, col: start.col, dir: -1, turns: 0 }];

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (let dir = 0; dir < DIRECTIONS.length; dir += 1) {
      const [dr, dc] = DIRECTIONS[dir];
      const nextRow = current.row + dr;
      const nextCol = current.col + dc;

      if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) {
        continue;
      }

      const nextTurns = current.dir === -1 || current.dir === dir ? current.turns : current.turns + 1;

      if (nextTurns > MAX_TURNS) {
        continue;
      }

      const cell = padded[nextRow][nextCol];
      if (cell !== null && !(nextRow === target.row && nextCol === target.col)) {
        continue;
      }

      if (visited[nextRow][nextCol][dir] <= nextTurns) {
        continue;
      }

      visited[nextRow][nextCol][dir] = nextTurns;

      if (nextRow === target.row && nextCol === target.col) {
        return true;
      }

      queue.push({ row: nextRow, col: nextCol, dir, turns: nextTurns });
    }
  }

  return false;
};

export const canConnect = (board: BoardMatrix, from: Position, to: Position) => {
  if (!isInside(board, from) || !isInside(board, to)) {
    return false;
  }

  if (isSamePosition(from, to)) {
    return false;
  }

  const fromValue = board[from.row][from.col];
  const toValue = board[to.row][to.col];

  if (fromValue === null || toValue === null) {
    return false;
  }

  if (fromValue !== toValue) {
    return false;
  }

  if (isStraightLineClear(board, from, to)) {
    return true;
  }

  if (canConnectWithSingleTurn(board, from, to)) {
    return true;
  }

  return canConnectWithDoubleTurn(board, from, to);
};

export const findFirstMatch = (board: BoardMatrix): MatchPair | null => {
  const positionsByValue = new Map<number, Position[]>();

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < (board[row]?.length ?? 0); col += 1) {
      const value = board[row][col];
      if (value === null) {
        continue;
      }

      const positions = positionsByValue.get(value) ?? [];
      positions.push({ row, col });
      positionsByValue.set(value, positions);
    }
  }

  for (const positions of positionsByValue.values()) {
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        if (canConnect(board, positions[i], positions[j])) {
          return { first: positions[i], second: positions[j] };
        }
      }
    }
  }

  return null;
};

export const hasAnyMatch = (board: BoardMatrix) => findFirstMatch(board) !== null;
