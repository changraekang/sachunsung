import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import styled, { css } from "styled-components";
import Board from "../components/shisen/Board";
import TopBar from "../components/shisen/TopBar";
import { generateBoard, isBoardCleared, shuffleBoard } from "../lib/shisen/generator";
import { canConnect, findFirstMatch } from "../lib/shisen/pathfinder";
import type {
  BoardMatrix,
  GameRules,
  GameStatus,
  MatchPair,
  Position,
} from "../lib/shisen/types";

const RULES: GameRules = {
  rows: 10,
  cols: 6,
  tileKinds: 15,
  timeLimit: 60,
  comboWindowMs: 3000,
  baseMatchScore: 10,
  comboBonus: 5,
  hintPenalty: 5,
  shufflePenalty: 10,
  timeBonusMultiplier: 2,
};

const BEST_SCORE_KEY = "shisen_sho_best_score";

interface GameState {
  board: BoardMatrix;
  selected: Position | null;
  focus: Position | null;
  hintPair: MatchPair | null;
  mismatchPair: MatchPair | null;
  score: number;
  bestScore: number;
  comboCount: number;
  lastMatchAt: number | null;
  remainingTime: number;
  isPaused: boolean;
  status: GameStatus;
}

type GameAction =
  | { type: "RESET"; board: BoardMatrix; bestScore: number }
  | { type: "SELECT"; position: Position | null }
  | { type: "MATCH_SUCCESS"; pair: MatchPair; timestamp: number }
  | { type: "MATCH_FAIL"; pair: MatchPair; nextSelection: Position | null }
  | { type: "CLEAR_MISMATCH" }
  | { type: "SET_HINT"; pair: MatchPair | null }
  | { type: "CLEAR_HINT" }
  | { type: "TICK" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "SET_BOARD"; board: BoardMatrix }
  | { type: "ADJUST_SCORE"; delta: number }
  | { type: "SET_FOCUS"; position: Position | null };

const positionsEqual = (a: Position | null, b: Position | null) => {
  if (a === null && b === null) {
    return true;
  }
  if (a === null || b === null) {
    return false;
  }
  return a.row === b.row && a.col === b.col;
};

const findFirstFilled = (board: BoardMatrix): Position | null => {
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < (board[row]?.length ?? 0); col += 1) {
      if (board[row][col] !== null) {
        return { row, col };
      }
    }
  }
  return null;
};

const createInitialState = (bestScore: number): GameState => {
  const board = generateBoard(RULES.rows, RULES.cols, RULES.tileKinds);
  return {
    board,
    selected: null,
    focus: findFirstFilled(board),
    hintPair: null,
    mismatchPair: null,
    score: 0,
    bestScore,
    comboCount: 0,
    lastMatchAt: null,
    remainingTime: RULES.timeLimit,
    isPaused: false,
    status: "playing",
  };
};

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "RESET": {
      return {
        board: action.board,
        selected: null,
        focus: findFirstFilled(action.board),
        hintPair: null,
        mismatchPair: null,
        score: 0,
        bestScore: action.bestScore,
        comboCount: 0,
        lastMatchAt: null,
        remainingTime: RULES.timeLimit,
        isPaused: false,
        status: "playing",
      };
    }
    case "SELECT": {
      if (positionsEqual(state.selected, action.position)) {
        return state;
      }
      return {
        ...state,
        selected: action.position,
        focus: action.position ?? state.focus,
        mismatchPair: null,
      };
    }
    case "MATCH_SUCCESS": {
      const updatedBoard = state.board.map((rowValues, row) =>
        rowValues.map((value, col) => {
          if (
            (row === action.pair.first.row && col === action.pair.first.col) ||
            (row === action.pair.second.row && col === action.pair.second.col)
          ) {
            return null;
          }
          return value;
        }),
      );

      const withinCombo =
        state.lastMatchAt !== null && action.timestamp - state.lastMatchAt <= RULES.comboWindowMs;
      const nextCombo = withinCombo ? state.comboCount + 1 : 1;
      const gained = RULES.baseMatchScore + (withinCombo ? RULES.comboBonus : 0);
      let score = state.score + gained;
      let bestScore = Math.max(state.bestScore, score);
      let status = state.status;
      let isPaused = state.isPaused;

      if (isBoardCleared(updatedBoard)) {
        const bonus = state.remainingTime * RULES.timeBonusMultiplier;
        score += bonus;
        bestScore = Math.max(bestScore, score);
        status = "won";
        isPaused = true;
      }

      const focus = findFirstFilled(updatedBoard);

      return {
        ...state,
        board: updatedBoard,
        selected: null,
        focus,
        hintPair: null,
        mismatchPair: null,
        comboCount: nextCombo,
        lastMatchAt: action.timestamp,
        score,
        bestScore,
        status,
        isPaused,
      };
    }
    case "MATCH_FAIL": {
      return {
        ...state,
        mismatchPair: action.pair,
        selected: action.nextSelection,
        focus: action.nextSelection ?? state.focus,
        comboCount: 0,
      };
    }
    case "CLEAR_MISMATCH": {
      if (!state.mismatchPair) {
        return state;
      }
      return {
        ...state,
        mismatchPair: null,
      };
    }
    case "SET_HINT": {
      return {
        ...state,
        hintPair: action.pair,
      };
    }
    case "CLEAR_HINT": {
      if (!state.hintPair) {
        return state;
      }
      return {
        ...state,
        hintPair: null,
      };
    }
    case "TICK": {
      if (state.isPaused || state.status !== "playing") {
        return state;
      }

      const nextTime = state.remainingTime - 1;
      if (nextTime <= 0) {
        return {
          ...state,
          remainingTime: 0,
          status: "lost",
          isPaused: true,
          selected: null,
          comboCount: 0,
        };
      }

      return {
        ...state,
        remainingTime: nextTime,
      };
    }
    case "TOGGLE_PAUSE": {
      if (state.status !== "playing") {
        return state;
      }
      return {
        ...state,
        isPaused: !state.isPaused,
      };
    }
    case "SET_BOARD": {
      const focus = findFirstFilled(action.board);
      return {
        ...state,
        board: action.board,
        selected: null,
        hintPair: null,
        mismatchPair: null,
        focus,
      };
    }
    case "ADJUST_SCORE": {
      const score = Math.max(0, state.score + action.delta);
      const bestScore = Math.max(state.bestScore, score);
      return {
        ...state,
        score,
        bestScore,
      };
    }
    case "SET_FOCUS": {
      if (positionsEqual(state.focus, action.position)) {
        return state;
      }
      return {
        ...state,
        focus: action.position,
      };
    }
    default:
      return state;
  }
};

const PageContainer = styled.main`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.background} 0%,
    ${({ theme }) => theme.colors.surfaceMuted} 100%
  );
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[2]};
  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-align: center;
`;

const Banner = styled.div`
  background: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.onWarning};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndices.overlay};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const OverlayCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => `${theme.spacing[5]} ${theme.spacing[6]}`};
  max-width: 420px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const OverlayTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const OverlayText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const OverlayActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const OverlayButton = styled.button<{ $variant?: "primary" | "ghost" }>`
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base},
    background-color ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.text};

  ${({ $variant, theme }) =>
    $variant === "primary" &&
    css`
      background: ${theme.colors.primary};
      color: ${theme.colors.onPrimary};
    `}

  ${({ $variant, theme }) =>
    $variant === "ghost" &&
    css`
      background: transparent;
      color: ${theme.colors.text};
      box-shadow: none;
      border: 1px solid ${theme.colors.border};
    `}

  &:hover {
    transform: translateY(-${({ theme }) => theme.spacing[1]});
  }
`;

const PauseBadge = styled.div`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  box-shadow: ${({ theme }) => theme.shadows.xs};
`;

const readBestScore = () => {
  if (typeof window === "undefined") {
    return 0;
  }
  const stored = window.localStorage.getItem(BEST_SCORE_KEY);
  return stored ? Number.parseInt(stored, 10) || 0 : 0;
};

const ShisenSho = () => {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => createInitialState(readBestScore()),
  );
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const tilesRemaining = useMemo(
    () => state.board.reduce((count, row) => count + row.filter((value) => value !== null).length, 0),
    [state.board],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(BEST_SCORE_KEY, String(state.bestScore));
  }, [state.bestScore]);

  useEffect(() => {
    if (state.status !== "playing" || state.isPaused || state.remainingTime <= 0) {
      return;
    }
    const timer = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state.isPaused, state.status, state.remainingTime]);

  useEffect(() => {
    if (!state.hintPair) {
      return;
    }
    const timeout = window.setTimeout(() => {
      dispatch({ type: "CLEAR_HINT" });
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [state.hintPair]);

  useEffect(() => {
    if (!state.mismatchPair) {
      return;
    }
    const timeout = window.setTimeout(() => {
      dispatch({ type: "CLEAR_MISMATCH" });
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [state.mismatchPair]);

  useEffect(() => {
    if (!bannerMessage) {
      return;
    }
    const timeout = window.setTimeout(() => setBannerMessage(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [bannerMessage]);

  const handleSelect = useCallback(
    (position: Position) => {
      if (state.status !== "playing" || state.isPaused) {
        return;
      }

      const value = state.board[position.row][position.col];
      if (value === null) {
        return;
      }

      if (!state.selected) {
        dispatch({ type: "SELECT", position });
        return;
      }

      if (positionsEqual(state.selected, position)) {
        dispatch({ type: "SELECT", position: null });
        return;
      }

      const first = state.selected;
      const firstValue = state.board[first.row][first.col];
      if (firstValue === null) {
        dispatch({ type: "SELECT", position });
        return;
      }

      if (firstValue !== value) {
        dispatch({
          type: "MATCH_FAIL",
          pair: { first, second: position },
          nextSelection: position,
        });
        return;
      }

      if (canConnect(state.board, first, position)) {
        dispatch({ type: "MATCH_SUCCESS", pair: { first, second: position }, timestamp: Date.now() });
      } else {
        dispatch({
          type: "MATCH_FAIL",
          pair: { first, second: position },
          nextSelection: position,
        });
      }
    },
    [state.board, state.isPaused, state.selected, state.status],
  );

  const handleHint = useCallback(() => {
    if (state.status !== "playing" || state.isPaused) {
      return;
    }
    const hint = findFirstMatch(state.board);
    if (!hint) {
      setBannerMessage("가능한 짝이 없습니다. 셔플을 사용해 보세요.");
      return;
    }
    dispatch({ type: "SET_HINT", pair: hint });
    dispatch({ type: "ADJUST_SCORE", delta: -RULES.hintPenalty });
  }, [state.board, state.isPaused, state.status]);

  const handleShuffle = useCallback(() => {
    if (state.status !== "playing" || state.isPaused) {
      return;
    }
    if (tilesRemaining <= 2) {
      setBannerMessage("셔플할 타일이 충분하지 않습니다.");
      return;
    }
    const shuffled = shuffleBoard(state.board);
    dispatch({ type: "SET_BOARD", board: shuffled });
    dispatch({ type: "ADJUST_SCORE", delta: -RULES.shufflePenalty });
  }, [state.board, state.isPaused, state.status, tilesRemaining]);

  const handlePauseToggle = useCallback(() => {
    if (state.status !== "playing") {
      return;
    }
    dispatch({ type: "TOGGLE_PAUSE" });
  }, [state.status]);

  const handleReset = useCallback(() => {
    const board = generateBoard(RULES.rows, RULES.cols, RULES.tileKinds);
    dispatch({ type: "RESET", board, bestScore: state.bestScore });
    setBannerMessage(null);
  }, [state.bestScore]);

  const handleFocusChange = useCallback((position: Position | null) => {
    dispatch({ type: "SET_FOCUS", position });
  }, []);

  const disableActions = state.status !== "playing" || state.isPaused;
  const pauseDisabled = state.status !== "playing";
  const showOverlay = state.status === "won" || state.status === "lost";

  const overlayTitle = state.status === "won" ? "축하합니다!" : "시간 초과";
  const overlayMessage =
    state.status === "won"
      ? `남은 시간 보너스 포함 최종 점수는 ${state.score}점입니다.`
      : "시간이 모두 지나 게임이 종료되었습니다.";

  return (
    <PageContainer>
      <Content>
        <Title>사천성</Title>
        <Subtitle>같은 무늬를 이어 타일을 모두 제거하세요. 최대 두 번까지 꺾을 수 있어요!</Subtitle>
        <TopBar
          timeRemaining={state.remainingTime}
          score={state.score}
          bestScore={state.bestScore}
          comboCount={state.comboCount}
          isPaused={state.isPaused}
          disableActions={disableActions}
          pauseDisabled={pauseDisabled}
          hintPenalty={RULES.hintPenalty}
          shufflePenalty={RULES.shufflePenalty}
          onHint={handleHint}
          onShuffle={handleShuffle}
          onPauseToggle={handlePauseToggle}
          onReset={handleReset}
        />
        {state.isPaused && state.status === "playing" ? <PauseBadge>일시정지됨</PauseBadge> : null}
        {bannerMessage ? <Banner>{bannerMessage}</Banner> : null}
        <Board
          board={state.board}
          selected={state.selected}
          hintPair={state.hintPair}
          mismatchPair={state.mismatchPair}
          focusPosition={state.focus}
          disabled={disableActions}
          onSelect={handleSelect}
          onFocusChange={handleFocusChange}
        />
      </Content>
      {showOverlay ? (
        <Overlay role="dialog" aria-modal="true">
          <OverlayCard>
            <OverlayTitle>{overlayTitle}</OverlayTitle>
            <OverlayText>{overlayMessage}</OverlayText>
            {state.status === "won" ? (
              <OverlayText>
                남은 시간 {state.remainingTime}초 × 보너스 {RULES.timeBonusMultiplier} =
                {" "}
                {state.remainingTime * RULES.timeBonusMultiplier}점
              </OverlayText>
            ) : null}
            <OverlayActions>
              <OverlayButton $variant="ghost" onClick={handleReset}>
                다시 시작
              </OverlayButton>
            </OverlayActions>
          </OverlayCard>
        </Overlay>
      ) : null}
    </PageContainer>
  );
};

export default ShisenSho;
