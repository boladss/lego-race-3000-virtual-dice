<script lang="ts">
  import FaceComponent from "../components/FaceComponent.svelte";
  import { PLAYER_NAMES, PLAYER_COLORS, type Dice, type Face, Piece, PieceType } from "$lib/types"

  /* 
  There are two main types of dice pieces: 
  (1) Movement pieces --- corresponds to a player
  (2) Special pieces --- does NOT correspond to a player (turbo, shortcut pieces)
  */
  export class EmptyPiece extends Piece {
    constructor() {super(PieceType.Empty)}

    getColor(): string { return "bg-stone-800"}
  }

  export class MovementPiece extends Piece {
    public player: Player = {} as Player;
    constructor(player: Player) {
      super(PieceType.Movement);
      this.player = player;
    }

    getColor(): string { return this.player.getBgColor(); }
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

  /*
  Main class handling per-player logic
  */

  export class Player {
    public name: string;
    private _piecesLeft: number = $state(0);

    constructor(name: string, piecesLeft: number) {
      this.name = name;
      this._piecesLeft = piecesLeft;
    }

    public get piecesLeft() { return this._piecesLeft; }

    public set piecesLeft(pieces: number) {
      if (pieces < 0) throw new Error('Pieces less than 0');
      this._piecesLeft = pieces;
    }

    public getTextColor(): string { return PLAYER_COLORS[this.name].textColor; }
    public getBgColor(): string { return PLAYER_COLORS[this.name].bgColor; }
  }

  /*
  Main class handling game logic
  */
  export class Race3000Game {
    private _players: Player[];
    private _dice: Dice = $state([]);
    private _currentPlayer: number = $state(0);
    private _currentDiceFace: number = $state(0);
    private _currentPlayerPlacedPiece: boolean = false; // Tongue twister

    // Initialize game with list of players and the initial dice
    constructor(players: Player[], dice: Dice) {
      this._players = players;
      this._dice = dice;
      this._currentPlayer = 0;
    }

    // Getters
    public get players() { return this._players; }
    public get dice() { return this._dice; }
    public get currentPlayer() { return this._currentPlayer; }
    public get currentDiceFace() { return this._currentDiceFace; }
    public get currentPlayerPlacedPiece() { return this._currentPlayerPlacedPiece; }

    public set currentPlayerPlacedPiece(state: boolean) { this._currentPlayerPlacedPiece = state; }

    // Function to set next player's turn
    public nextPlayer(): void {
      this._currentPlayer = (this._currentPlayer + 1) % this._players.length;
      this._currentPlayerPlacedPiece = false;
    }

    // Function to remove a player from the game (typically as they've already finished the lap)
    private removePlayer(playerToRemove: Player): void {
      this._players = this._players.filter((player) => player !== playerToRemove);
      // TODO: Check logic with having to go to the next player
    }

    // Function to roll the dice
    public rollDice(): void {
      const randomIndex = Math.floor(Math.random() * this._dice.length);
      this._currentDiceFace = randomIndex;
      // TODO: Handle mid-turn steps before going to the next player---this should be confirmed before handing to next
      this.nextPlayer();
    }

    // Function to replace a piece on the current face
    public setDicePiece(playerIndex: number, diceIndex: number, pieceIndex: number): void {
      const movementPiece = new MovementPiece(this._players[playerIndex]);
      this._players[playerIndex].piecesLeft--; // Subtract one piece from the player
      this._dice[diceIndex][pieceIndex] = movementPiece; // Update the movement piece
      return;
    }

    public checkPlayerPieces(playerIndex: number): number {
      return this.players[playerIndex].piecesLeft;
    }
  }

  /*
  Game initialization!
  */

  // Initialize values
  let game: Race3000Game = $state({} as Race3000Game);
  let dice: Dice = $state([]);
  // let selectedPlayers: string[] = [];
  let selectedPlayers: string[] = $state(["red", "green", "blue", "white"]);
  // let gameStarted: boolean = false;
  let gameStarted: boolean = $state(true);
  configGame();
  
  // Game configuration
  // TODO: Revert to player selection---skipping just for ease of testing
  function configGame() {
    // if (selectedPlayers.length > 0) {
    if (true) {

      // Generate players from checklist
      let players: Player[] = [];
      for (let playerColor of selectedPlayers) {
        let player: Player = new Player(playerColor, 7); // New player has 7 pieces by default
        players.push(player);
      }

      // Generate empty dice faces
      for (let i = 0; i < 6; i++) {
        let face: Face = [];
        for (let j = 0; j < 4; j++) {
          let piece = new EmptyPiece();
          face.push(piece);
        }
        dice.push(face);
      }

      // Set turbo tiles (fixed)
      // First face
      dice[0][0] = new SpecialPiece("turbo");
      dice[0][1] = new SpecialPiece("turbo");
      // Last face
      dice[5][2] = new SpecialPiece("turbo");
      dice[5][3] = new SpecialPiece("turbo");

      // Create instance of game
      game = new Race3000Game(players, dice);
      gameLoop();
    }
  };

  // TODO: Might not be necessary
  function gameLoop() {
    // Update UI
    gameStarted = true;

    // Update display dice
    dice = game.dice;
  }
</script>


<!-- Game loop -->
<div class="container flex flex-col h-full w-full m-auto items-center">
  <h1 class="m-10">LEGO® Race 3000 Virtual Dice</h1>
  {#if gameStarted}
    
    <!-- Face display -->
    <div class="mb-10">
      <FaceComponent game={game} bind:face={dice[game.currentDiceFace]} diceIndex={game.currentDiceFace} large={true}/>
    </div>

    <!-- Temporary debug menu; includes roll button -->
    <div class="container flex flex-col m-auto items-center">
      <h2>Debug Menu</h2>
      <div>
        Current Player: {game.players[game.currentPlayer].name}  rolled {game.currentDiceFace} <br/>
        Pieces left: <br/>
        {#each game.players as player }
          {player.name} {player.piecesLeft} <br/>
        {/each}
      </div>

      <button 
        onclick={() => game.rollDice()}
        class="mb-10 p-4 bg-gray-200 rounded-lg hover:shadow-xl"
        >
        Roll
      </button>
    </div>
    
    <!-- Display full dice -->
    <div class="grid grid-cols-4 gap-1">
      <div class="col-span-2"></div>
      <FaceComponent game={game} bind:face={dice[0]} diceIndex={0} />
      <div class="col-span-1"></div>
      
      <FaceComponent game={game} bind:face={dice[1]} diceIndex={1} />
      <FaceComponent game={game} bind:face={dice[2]} diceIndex={2} />
      <FaceComponent game={game} bind:face={dice[3]} diceIndex={3} />
      <FaceComponent game={game} bind:face={dice[4]} diceIndex={4} />
    
      <div class="col-span-2"></div>
      <FaceComponent game={game} bind:face={dice[5]} diceIndex={5} />
      <div class="col-span-1"></div>
    </div>
    

  <!-- Start a new game -->
  {:else}
    <h2>Select Players</h2>

    <!-- List of possible players -->
    <form class="flex flex-col items-start mt-4">
      {#each PLAYER_NAMES as player}
        <label class="flex items-center">
          <input type="checkbox" bind:group={selectedPlayers} value={player} />
          <span class={`ml-2 ${PLAYER_COLORS[player].textColor} font-semibold`}>
            {player.charAt(0).toUpperCase() + player.slice(1)}
          </span>
        </label>
      {/each}
    </form>

    <button 
      class="mt-10 p-4 bg-gray-200 rounded-lg hover:shadow-xl"
      onclick={configGame} 
      aria-label="Start a new game"
    >Start a new game!</button>
  {/if}
</div>
