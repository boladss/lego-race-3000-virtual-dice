<script lang="ts">
  import DiceComponent from "../components/DiceComponent.svelte";
  import FaceComponent from "../components/FaceComponent.svelte";
  import { PLAYER_NAMES, PLAYER_COLORS, Player, MovementPiece } from "$lib/types"
  import { type Dice, type Face, type GamePiece, EmptyPiece } from "$lib/types";

  export class Race3000Game {
    public players: Player[];
    public dice: Dice = $state([]);
    public currentPlayer: Player = $state({} as Player);
    public currentDiceFace: number = $state(0);

    constructor(players: Player[], dice: Dice) {
      this.players = players;
      this.dice = dice;
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

    // Roll the dice, return a face
    rollDice() {
      const randomIndex = Math.floor(Math.random() * this.dice.length);
      this.currentDiceFace = randomIndex;
      this.nextPlayer();

      console.log("ROLLED: ", this.currentDiceFace, " with ", this.currentPlayer.name);
    }

    replacePieceOnCurrentFace(pieceIndex: number): void {
      const movementPiece = new MovementPiece(this.currentPlayer);
      this.dice[this.currentDiceFace][pieceIndex] = movementPiece;
      return;
    }
  }

  let game: Race3000Game = $state({} as Race3000Game);

  let dice: Dice = [];
  
  // let selectedPlayers: string[] = [];
  let selectedPlayers: string[] = $state(["red", "green", "blue", "white"]);
  
  // let gameStarted: boolean = false;
  let gameStarted: boolean = $state(true);
  configGame();
  
  function configGame() {
    // if (selectedPlayers.length > 0) {
    if (true) {
      // Generate players from checklist
      let players: Player[] = [];
      for (let playerColor of selectedPlayers) {
        // Create new player with 7 pieces (default)
        let player: Player = new Player(playerColor, 7);
        players.push(player);
      }

      // Generate dice faces
      for (let i = 0; i < 6; i++) {
        let face: Face = [];
        
        for (let j = 0; j < 4; j++) {

          let piece: GamePiece;
          const randomIndex: number = Math.floor(Math.random() * (players.length + 1));
          if (randomIndex > 3) {
            piece = new EmptyPiece();
          } else {
            const rolledPlayer = players[randomIndex]
            piece = new MovementPiece(rolledPlayer);
          }
          face.push(piece);
        }

        dice.push(face);
      }

      game = new Race3000Game(players, dice);
      gameLoop();
    }
  };

  function gameLoop() {
    gameStarted = true;

    console.log(game.currentPlayer);
  }
</script>


<!-- Game loop -->
<div class="container flex flex-col h-full w-full m-auto items-center">
  <h1 class="m-10">LEGO® Race 3000 Virtual Dice</h1>
  {#if gameStarted}
    
    <!-- Face display -->
    <div class="mb-10">
      <FaceComponent game={game} index={game.currentDiceFace} large={true}/>
    </div>

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
    
    <DiceComponent game={game} />
    

  <!-- Start a new game -->
  {:else}
    <h2>Select Players</h2>

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
    >
    Start a new game!
    </button>
  {/if}
</div>
