export type Race3000Game = {
  players: Player[]
  currentTurn: Player
  dice: Dice
}

export type Player = {
  color: string;
  piecesLeft: number;
}

export type Dice = {
  faces: Face[]
}

export type Face = {
  pieces: Piece[]
}

export enum PieceType {
  "movement",
  "turbo",
  "shortcut"
}

export type Piece = {
  type: PieceType
  player: Player | null
}
