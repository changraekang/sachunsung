import { useCallback, useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import styled from "styled-components";
import Tile from "./Tile";
import type { BoardMatrix, MatchPair, Position } from "../../lib/shisen/types";

interface BoardProps {
  board: BoardMatrix;
  selected: Position | null;
  hintPair: MatchPair | null;
  mismatchPair: MatchPair | null;
  focusPosition: Position | null;
  disabled: boolean;
  onSelect(position: Position): void;
  onFocusChange(position: Position | null): void;
}

const BoardContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[3]};
  box-sizing: border-box;
`;

const GridWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 960px;
`;

const Grid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: box-shadow ${({ theme }) => theme.transitions.base};
  touch-action: manipulation;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing[1]};
    padding: ${({ theme }) => theme.spacing[2]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[1]};
  }
`;

const toKey = ({ row, col }: Position) => `${row}-${col}`;

const positionsEqual = (a: Position | null, b: Position | null) => {
  if (a === null && b === null) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  return a.row === b.row && a.col === b.col;
};

const findFirstAvailable = (board: BoardMatrix): Position | null => {
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < (board[row]?.length ?? 0); col += 1) {
      if (board[row][col] !== null) {
        return { row, col };
      }
    }
  }
  return null;
};

const Board = ({
  board,
  selected,
  hintPair,
  mismatchPair,
  focusPosition,
  disabled,
  onSelect,
  onFocusChange,
}: BoardProps) => {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const hintPositions = useMemo(() =>
    hintPair ? [hintPair.first, hintPair.second].map(toKey) : [],
  [hintPair]);

  const mismatchPositions = useMemo(() =>
    mismatchPair ? [mismatchPair.first, mismatchPair.second].map(toKey) : [],
  [mismatchPair]);

  useEffect(() => {
    if (!focusPosition) {
      return;
    }

    const key = toKey(focusPosition);
    const element = tileRefs.current[key];
    if (element) {
      element.focus();
    }
  }, [focusPosition, board]);

  useEffect(() => {
    if (!focusPosition) {
      const fallback = findFirstAvailable(board);
      if (!positionsEqual(fallback, focusPosition)) {
        onFocusChange(fallback);
      }
      return;
    }

    const { row, col } = focusPosition;
    if (board[row]?.[col] === null) {
      const fallback = findFirstAvailable(board);
      if (!positionsEqual(fallback, focusPosition)) {
        onFocusChange(fallback);
      }
    }
  }, [board, focusPosition, onFocusChange]);

  const handleFocus = useCallback(() => {
    if (disabled) {
      return;
    }

    if (focusPosition) {
      const key = toKey(focusPosition);
      tileRefs.current[key]?.focus();
      return;
    }

    const fallback = findFirstAvailable(board);
    onFocusChange(fallback);
  }, [board, disabled, focusPosition, onFocusChange]);

  const findNextHorizontal = useCallback(
    (direction: 1 | -1) => {
      if (!focusPosition) {
        return findFirstAvailable(board);
      }

      const { row } = focusPosition;
      for (
        let col = focusPosition.col + direction;
        col >= 0 && col < cols;
        col += direction
      ) {
        if (board[row][col] !== null) {
          return { row, col };
        }
      }
      return focusPosition;
    },
    [board, cols, focusPosition],
  );

  const findNextVertical = useCallback(
    (direction: 1 | -1) => {
      if (!focusPosition) {
        return findFirstAvailable(board);
      }

      const { col } = focusPosition;
      for (
        let row = focusPosition.row + direction;
        row >= 0 && row < rows;
        row += direction
      ) {
        if (board[row][col] !== null) {
          return { row, col };
        }
      }
      return focusPosition;
    },
    [board, focusPosition, rows],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      let next: Position | null = null;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          next = findNextHorizontal(1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          next = findNextHorizontal(-1);
          break;
        case "ArrowDown":
          event.preventDefault();
          next = findNextVertical(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          next = findNextVertical(-1);
          break;
        case "Enter":
        case " ":
          if (focusPosition) {
            event.preventDefault();
            onSelect(focusPosition);
          }
          return;
        default:
          return;
      }

      if (next && !positionsEqual(next, focusPosition)) {
        onFocusChange(next);
      }
    },
    [disabled, findNextHorizontal, findNextVertical, focusPosition, onFocusChange, onSelect],
  );

  return (
    <BoardContainer>
      <GridWrapper
        role="grid"
        aria-label="사천성 보드"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        <Grid $cols={cols}>
          {board.map((rowValues, row) =>
            rowValues.map((value, col) => {
              const position = { row, col };
              const key = toKey(position);
              const isSelected = positionsEqual(selected, position);
              const isHinted = hintPositions.includes(key);
              const isMismatch = mismatchPositions.includes(key);
              const isFocused = positionsEqual(focusPosition, position);

              return (
                <Tile
                  key={key}
                  ref={(element) => {
                    tileRefs.current[key] = element;
                  }}
                  value={value}
                  position={position}
                  isSelected={isSelected}
                  isHinted={isHinted}
                  isMismatch={isMismatch}
                  isFocused={isFocused}
                  disabled={disabled}
                  onSelect={onSelect}
                />
              );
            }),
          )}
        </Grid>
      </GridWrapper>
    </BoardContainer>
  );
};

export default Board;
