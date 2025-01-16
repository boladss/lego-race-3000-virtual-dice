<script lang="ts">
  import FaceComponent from "../components/FaceComponent.svelte";
  import { PLAYER_NAMES, PLAYER_COLORS, Player, MovementPiece, SpecialPiece } from "$lib/types"
  import { type Dice, type Face, type GamePiece, EmptyPiece } from "$lib/types";

  export class Race3000Game {
    public players: Player[];
    public dice: Dice = $state([]);
    public currentPlayer: Player = $state({} as Player);
    public currentDiceFace: number = $state(0);

    // Initialize game with list of players and the initial dice
    constructor(players: Player[], dice: Dice) {
      this.players = players;
      this.dice = dice;
      this.currentPlayer = players[0];
    }

    // Function to set next player's turn
    nextPlayer(): void {
      const currentIndex = this.players.indexOf(this.currentPlayer);
      const nextIndex = (currentIndex + 1) % this.players.length;
      this.currentPlayer = this.players[nextIndex];
    }

    // Function to remove a player from the game (typically as they've already finished the lap)
    removePlayer(playerToRemove: Player): void {
      this.players = this.players.filter((player) => player !== playerToRemove);
      // TODO: Check logic with having to go to the next player
    }

    // Function to roll the dice
    rollDice(): void {
      const randomIndex = Math.floor(Math.random() * this.dice.length);
      this.currentDiceFace = randomIndex;
      // TODO: Handle mid-turn steps before going to the next player---this should be confirmed before handing to next
      this.nextPlayer();
      console.log(`Player ${this.currentPlayer} rolled a ${this.currentDiceFace}`);
    }

    // Function to replace a piece on the current face
    replacePieceOnCurrentFace(pieceIndex: number): void {
      const movementPiece = new MovementPiece(this.currentPlayer);
      this.dice[this.currentDiceFace][pieceIndex] = movementPiece;
      return;
    }
  }

  // Initialize values
  let game: Race3000Game = $state({} as Race3000Game);
  let dice: Dice = $state([]);
  // let selectedPlayers: string[] = [];
  let selectedPlayers: string[] = $state(["red", "green", "blue", "white"]);
  // let gameStarted: boolean = false;
  let gameStarted: boolean = $state(true);
  configGame();
  
  // Initial configuration of game
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
      <FaceComponent game={game} bind:face={dice[game.currentDiceFace]} large={true}/>
    </div>

    <!-- Temporary debug menu; includes roll button -->
    <div class="container flex flex-col m-auto items-center">
      <h2>Debug Menu</h2>
      <div>
        Current Player: {game.currentPlayer.name} {game.currentDiceFace}
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
      <FaceComponent game={game} bind:face={dice[0]} />
      <div class="col-span-1"></div>
      
      <FaceComponent game={game} bind:face={dice[1]} />
      <FaceComponent game={game} bind:face={dice[2]} />
      <FaceComponent game={game} bind:face={dice[3]} />
      <FaceComponent game={game} bind:face={dice[4]} />
    
      <div class="col-span-2"></div>
      <FaceComponent game={game} bind:face={dice[5]} />
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
