import { hasAnyMatch } from "./pathfinder";
import type { BoardMatrix } from "./types";

const DEFAULT_ATTEMPTS = 20;

const buildBoardFromValues = (values: number[], rows: number, cols: number): BoardMatrix => {
  const board: BoardMatrix = Array.from({ length: rows }, () => Array<number | null>(cols).fill(null));

  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      board[row][col] = values[index];
      index += 1;
    }
  }

  return board;
};

const shuffleValues = <T,>(input: T[]) => {
  const values = [...input];
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
};

export const generateBoard = (
  rows: number,
  cols: number,
  tileKinds: number,
  ensureMatch = true,
  attempts = DEFAULT_ATTEMPTS,
): BoardMatrix => {
  if ((rows * cols) % 2 !== 0) {
    throw new Error("The Shisen-Sho board requires an even number of cells.");
  }

  const totalCells = rows * cols;
  const values: number[] = [];
  const pairCount = totalCells / 2;

  for (let index = 0; index < pairCount; index += 1) {
    const value = index % tileKinds;
    values.push(value, value);
  }

  let bestBoard = buildBoardFromValues(values, rows, cols);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const shuffledValues = shuffleValues(values);
    const board = buildBoardFromValues(shuffledValues, rows, cols);

    if (!ensureMatch || hasAnyMatch(board)) {
      return board;
    }

    bestBoard = board;
  }

  return bestBoard;
};

export const shuffleBoard = (
  board: BoardMatrix,
  ensureMatch = true,
  attempts = DEFAULT_ATTEMPTS,
): BoardMatrix => {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const tiles: number[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const value = board[row][col];
      if (value !== null) {
        tiles.push(value);
      }
    }
  }

  if (tiles.length <= 1) {
    return board;
  }

  let fallback = board;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const shuffled = shuffleValues(tiles);
    let index = 0;
    const nextBoard: BoardMatrix = board.map((row) =>
      row.map((cell) => {
        if (cell === null) {
          return null;
        }
        const nextValue = shuffled[index];
        index += 1;
        return nextValue;
      }),
    );

    if (!ensureMatch || hasAnyMatch(nextBoard)) {
      return nextBoard;
    }

    fallback = nextBoard;
  }

  return fallback;
};

export const isBoardCleared = (board: BoardMatrix) =>
  board.every((row) => row.every((value) => value === null));
