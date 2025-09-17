export type TileValue = number | null;

export interface Position {
  row: number;
  col: number;
}

export type BoardMatrix = TileValue[][];

export interface MatchPair {
  first: Position;
  second: Position;
}

export type GameStatus = "playing" | "won" | "lost";

export interface GameRules {
  readonly rows: number;
  readonly cols: number;
  readonly tileKinds: number;
  readonly timeLimit: number;
  readonly comboWindowMs: number;
  readonly baseMatchScore: number;
  readonly comboBonus: number;
  readonly hintPenalty: number;
  readonly shufflePenalty: number;
  readonly timeBonusMultiplier: number;
}
