export class Race3000Game {
  private currentPlayer: Player;

  constructor(
    public players: Player[],
    public dice: Dice
  ) {
    this.currentPlayer = players[0];
  }

  // Set next player's turn
  nextPlayer(): void {
    const currentIndex = this.players.indexOf(this.currentPlayer);
    const nextIndex = (currentIndex + 1) % this.players.length;

    this.currentPlayer = this.players[nextIndex];
  }

  // Remove a player from the game (typically as they've already finished the lap)
  removePlayer(playerToRemove: Player): void {
    this.players = this.players.filter((player) => player !== playerToRemove);
  }
}

// Possible player names
export const PLAYER_NAMES = ["red", "green", "blue", "white"];

// Look-up table for rendering player colors
export const PLAYER_COLORS: { [key: string]: { textColor: string, bgColor: string }} = {
  "red": { textColor: "text-red-700", bgColor: "bg-red-600"},
  "green": { textColor: "text-lime-600", bgColor: "bg-lime-400"},
  "blue": { textColor: "text-cyan-800", bgColor: "bg-cyan-600"},
  "white": { textColor: "text-stone-700", bgColor: "bg-stone-100"},
};

export class Player {
  constructor(
    public name: string,
    public piecesLeft: number,
  ) {}

  getTextColor(): string {
    return PLAYER_COLORS[this.name].textColor;
  }

  getBgColor(): string {
    return PLAYER_COLORS[this.name].bgColor;
  }
}

export type Dice = Face[];
export type Face = Piece[];

export enum PieceType {
  Empty = "Empty",
  Movement = "Movement",
  Special = "Special",
}

/* 
There are two main types of dice pieces: 
(1) Movement pieces --- corresponds to a player
(2) Special pieces --- does NOT correspond to a player (turbo, shortcut pieces)
*/
export abstract class Piece {
  constructor(public type: PieceType) {}
  abstract getColor(): string;
}

export class EmptyPiece extends Piece {
  constructor() {super(PieceType.Empty)}

  getColor(): string { return "bg-pink-500"}
}

export class MovementPiece extends Piece {
  constructor(public player: Player) {
    super(PieceType.Movement);
  }

  getColor(): string { return this.player.getBgColor(); }
}

export class SpecialPiece extends Piece {
  constructor(public name: string, public color: string) {
    super(PieceType.Special);
  }

  getColor(): string { return this.color; }
}

export type GamePiece = EmptyPiece | MovementPiece | SpecialPiece;