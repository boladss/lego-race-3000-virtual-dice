<script module lang="ts">
  import FaceComponent from "../components/FaceComponent.svelte";
  import { type Dice, type Face, Piece, PieceType, type GameState, type TurnState, EmptyPiece, SpecialPiece } from "$lib/types"
  import { PLAYER_NAMES, PLAYER_COLORS } from "$lib/players";

  const TOTAL_MOVEMENT_PIECES = 7;

  /* ##### ##### ##### ##### #####
  There are three main types of dice pieces: 
  (1) Movement pieces --- corresponds to a player
  (2) Special pieces --- does NOT correspond to a player (turbo, shortcut pieces)
  (3) Empty pieces --- empty pieces ...
  ##### ##### ##### ##### ##### */
  export class MovementPiece extends Piece {
    public player: Player = {} as Player;
    constructor(player: Player) {
      super(PieceType.Movement);
      this.player = player;
    }

    getColor(): string { return this.player.getBgColor(); }
  }

  /* ##### ##### ##### ##### #####
  Main class handling per-player logic
  ##### ##### ##### ##### ##### */

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

  /* ##### ##### ##### ##### #####
  Main class handling game logic
  ##### ##### ##### ##### ##### */
  export class Race3000Game {
    private _players: Player[];
    private _dice: Dice = $state([]);
    private _currentPlayerTurn: number = $state(0);
    private _currentPlayerSubturn: number = $state(0);
    private _currentDiceFace: number = $state(0);

    private _gameState: GameState = $state("init");
    private _turnState: TurnState = $state("move");

    // Flags upon flags upon flags
    private _currentPlayerRolled: boolean = $state(true); // Defaults to true due to initialization
    private _currentPlayerPlacedPiece: boolean = $state(false); // Tongue twister
    private _currentPlayerInitialPiece: boolean = $state(false); // These are such awful names

    private _oilSlickRemovedPiece: boolean = $state(false);

    // Initialize game with list of players and the initial dice
    constructor(players: Player[], dice: Dice) {
      this._players = players;
      this._dice = dice;
    }

    // Getters
    public get players() { return this._players; }
    public get dice() { return this._dice; }
    public get currentPlayerTurn() { return this._currentPlayerTurn; }
    public get currentPlayerSubturn() { return this._currentPlayerSubturn; }
    public get currentDiceFace() { return this._currentDiceFace; }
    
    public get currentPlayerRolled() { return this._currentPlayerRolled; }
    public get currentPlayerPlacedPiece() { return this._currentPlayerPlacedPiece; }
    public get currentPlayerInitialPiece() { return this._currentPlayerInitialPiece; }

    public get oilSlickRemovedPiece() { return this._oilSlickRemovedPiece; }

    public get gameState() { return this._gameState; }
    public get turnState() { return this._turnState; }

    // Function to set next player's turn
    public nextTurn(): void {
      this._currentPlayerTurn = (this._currentPlayerTurn + 1) % this._players.length;
      this._currentPlayerSubturn = this._currentPlayerTurn;
      
      this._currentPlayerRolled = false;
      this._currentPlayerPlacedPiece = false;
    }

    public nextSubturn(): void {
      // Main gameplay loop
      if (this._gameState === "main") {
        /* 
        Given: 
        (a) an empty space on the current dice face
        (b) the player who rolled has NOT YET placed a movement piece on this face; AND
        (c) the player who rolled still has pieces remaining
        */

        if (
          this._dice[this._currentDiceFace].some(piece => piece instanceof EmptyPiece) 
          && this._players[this._currentPlayerTurn].piecesLeft > 0
          && !this._currentPlayerPlacedPiece) 
        {
          alert("Place a movement piece first!");
        } else {
          this._oilSlickRemovedPiece = false;
          const nextPlayerIndex = (this.currentPlayerSubturn + 1) % this._players.length;
    
          // Check if subturns have finished (already back at player who rolled the dice)
          if (nextPlayerIndex !== this._currentPlayerTurn) this._currentPlayerSubturn = nextPlayerIndex;
          else game.nextTurn();
        }
      }

      // Initialization state --- place movement tiles alongside turbo tiles
      else if (this._gameState === "init") {
        if ( !this._currentPlayerInitialPiece ) {
          alert("Place a movement piece first!");
        } else {
          this._currentPlayerInitialPiece = false;
          const nextPlayerIndex = (this.currentPlayerSubturn + 1) % this._players.length;

          // Check if subturns have finished (already back at player who rolled the dice)
          if (nextPlayerIndex !== this._currentPlayerTurn) this._currentPlayerSubturn = nextPlayerIndex;
          else {
            // Finish initialization, transfer to main game state
            this._gameState = "main";
            
            // Can't use nextTurn() as that would give the first turn to player 2; need to assign
            this._currentPlayerSubturn = this._currentPlayerTurn;
            this._currentPlayerRolled = false;
            this._currentPlayerPlacedPiece = false;
          };
        }
      }
    }

    public hitOilSlick(): void {
      // Check if current player has already placed a movement piece for their turn (if valid space exists)
      if (this._dice[this._currentDiceFace].some(piece => piece instanceof EmptyPiece)
        && !this._currentPlayerPlacedPiece) {
        alert("Place a movement piece first!");
      } else {
        // TODO: Temporary, just swaps between modes
        if (this._turnState === "move") this._turnState = "oil";
        else this._turnState = "move";

        // TODO: Catch for when player has no movement pieces on the dice (nothing to remove)

        console.log("TURN STATE: ", this._turnState);
        alert(`Oil slick for ${this._players[this._currentPlayerSubturn].name}`);
      }
    }

    public takePitStop(): void {
      // Check if current player has already placed a movement piece for their turn (if valid space exists)
      if (this._dice[this._currentDiceFace].some(piece => piece instanceof EmptyPiece)
        && !this._currentPlayerPlacedPiece) {
        alert("Place a movement piece first!");
      } else {
        alert(`Pit stop for ${this._players[this._currentPlayerSubturn].name}!`);
        // TODO: Pit stop logic
      }
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
      this._currentPlayerRolled = true;

      /* 
      When initial dice face is already full, mark the current player as having placed a piece.
      This prevents misordering of sub-moves, e.g.,
      - hitting an oil slick first
      - removing a piece from the current face
      - replacing it with a turn movement piece
      */
      if (this._dice[this._currentDiceFace].every(piece => !(piece instanceof EmptyPiece))) {
        console.log("Full face!");
        this._currentPlayerPlacedPiece = true; 
      }
    }

    // Function to replace a piece on the current face
    public setDicePiece(playerIndex: number, diceIndex: number, pieceIndex: number, mode: null | "oil" | "pit" = null): void {
      if (mode === "oil") {
        const emptyPiece = new EmptyPiece();
        this._players[playerIndex].piecesLeft++; // Add another free piece to the player
        this._dice[diceIndex][pieceIndex] = emptyPiece; // Update empty piece
        this._oilSlickRemovedPiece = true;
        this._turnState = "move";
      } else {
        const movementPiece = new MovementPiece(this._players[playerIndex]);
        this._players[playerIndex].piecesLeft--; // Subtract one piece from the player
        this._dice[diceIndex][pieceIndex] = movementPiece; // Update the movement piece
        if (this._gameState === "init") this._currentPlayerInitialPiece = true;
        else this._currentPlayerPlacedPiece = true;
      }
      return;
    }

    public checkPlayerPieces(playerIndex: number): number {
      return this.players[playerIndex].piecesLeft;
    }
  }

  /* ##### ##### ##### ##### #####
  Game initialization!
  ##### ##### ##### ##### ##### */

  // Initialize values
  let game: Race3000Game = $state({} as Race3000Game);
  let dice: Dice = $state([]);
  // let selectedPlayers: string[] = [];
  let selectedPlayers: string[] = $state(PLAYER_NAMES);
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
        let player: Player = new Player(playerColor, TOTAL_MOVEMENT_PIECES); // New player has 7 pieces by default
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

  // Function to display the "Roll dice" button
  function showRollButton(): boolean {
    return ((game.currentPlayerTurn === game.currentPlayerSubturn) 
      && (game.currentPlayerRolled === false)
      && (game.gameState === "main"));
  }

  // Function to display "confirm" button
  function showConfirmButton(): boolean {
    return (game.currentPlayerRolled === true) || (game.gameState === "init");
  }

  // TODO: Might not be necessary
  function gameLoop() {
    // Update UI
    gameStarted = true;

    // Update display dice
    dice = game.dice;
  }

  const button: string = "p-4 bg-gray-200 rounded-lg hover:shadow-xl";
</script>


<!-- Game loop -->
<div class="container flex flex-col h-full w-full m-auto items-center">
  <h1 class="m-10">LEGO® Race 3000 Virtual Dice</h1>
  {#if gameStarted}
    
    <!-- Main face display -->
    {#if game.gameState === "init"} 
      <!-- Initialization --- shows both faces with turbo tiles -->
      <div class="space-x-10 flex flex-row ">
        <FaceComponent game={game} bind:face={dice[0]} diceIndex={0} large={true}/>
        <FaceComponent game={game} bind:face={dice[5]} diceIndex={5} large={true}/>
      </div>
    {:else}
      <!-- Main game loop --- shows rolled dice face -->
      <div>
        <FaceComponent game={game} bind:face={dice[game.currentDiceFace]} diceIndex={game.currentDiceFace} large={true}/>
      </div>
    {/if}
    
    <!-- Temporary debug menu; includes roll button -->
    <div class="container flex flex-col m-auto items-center">
      <!--  Button to roll dice! -->
      {#if showRollButton()}
        <button 
          onclick={() => game.rollDice()}
          class="my-10 {button}"
          >
          Roll ({game.players[game.currentPlayerTurn].name})
        </button>
      {/if}

      <!-- Button to confirm subturns, in between rolling of dice -->
      {#if showConfirmButton()}
      <div class="flex flex-col my-10 space-y-2">
        <button 
          onclick={() => game.nextSubturn()}
          class="{button}"
          >
          End move ({game.players[game.currentPlayerSubturn].name})!
        </button>

        {#if (game.gameState === "main")}
          <div class="flex flex-row space-x-2">
            {#if (!game.oilSlickRemovedPiece)}
              <button onclick={() => game.hitOilSlick()} class="{button}">Hit an oil slick?</button>
            {:else}
              <button disabled class="{button} bg-gray-400 hover:cursor-not-allowed">Hit an oil slick?</button>
            {/if}

            <button 
              onclick={() => game.takePitStop()}
              class="{button}"
              >
              Taken pit stop?
            </button>
          </div>
        {/if}

      </div>
      {/if}

      <h2><b>Debug Menu</b></h2>
      <div>
        {game.players[game.currentPlayerTurn].name}  rolled {game.currentDiceFace} <br/>
        {game.players[game.currentPlayerSubturn].name} currently moving <br/><br/>
        <b>Pieces left:</b> <br/>
        {#each game.players as player }
          {player.name} {player.piecesLeft} <br/>
        {/each}
      </div>
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
            {player}
          </span>
        </label>
      {/each}
    </form>

    <button 
      class="mt-10 {button}"
      onclick={configGame} 
      aria-label="Start a new game"
    >Start a new game!</button>
  {/if}
</div>
