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

export class EmptyPiece extends Piece {
  constructor() {super(PieceType.Empty)}

  getColor(): string { return "bg-stone-800"}
}

export class SpecialPiece extends Piece {
  public name: string = "";
  constructor(name: string) {
    super(PieceType.Special);
    this.name = name;
  }

  getColor(): string { 
    if (this.name === "turbo") return "bg-orange-500" ;
    else return "bg-amber-300";
  }
}

export type GameState = "init" | "main" | "finish";
export type TurnState = "move" | "oil" | "pit";