// Possible player names
export const PLAYER_NAMES = ["red", "green", "blue", "white"];

// Look-up table for rendering player colors
export const PLAYER_COLORS: { [key: string]: { textColor: string, bgColor: string }} = {
  "red": { textColor: "text-red-700", bgColor: "bg-red-600"},
  "green": { textColor: "text-lime-600", bgColor: "bg-lime-400"},
  "blue": { textColor: "text-cyan-800", bgColor: "bg-cyan-600"},
  "white": { textColor: "text-stone-700", bgColor: "bg-stone-100"},
};

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