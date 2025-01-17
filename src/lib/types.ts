export type Dice = Face[];
export type Face = Piece[];

export enum PieceType {
  Empty = "Empty",
  Movement = "Movement",
  Special = "Special",
}

export abstract class Piece {
  constructor(public type: PieceType) {}
  abstract getColor(): string;
}

export type GameState = "init" | "main" | "finish";