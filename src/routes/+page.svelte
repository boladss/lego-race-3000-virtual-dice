<script lang="ts">
  import DiceComponent from "../components/DiceComponent.svelte";
  import FaceComponent from "../components/FaceComponent.svelte";
  import { PLAYER_NAMES, PLAYER_COLORS, Player, Race3000Game, MovementPiece } from "$lib/types"
  import { type Dice, type Face, type GamePiece, EmptyPiece } from "$lib/types";

  let game: Race3000Game;

  let dice: Dice = [];
  let displayFace: Face = [];
  
  // let selectedPlayers: string[] = [];
  let selectedPlayers: string[] = ["red", "green", "blue", "white"];
  
  // let gameStarted: boolean = false;
  let gameStarted: boolean = true;
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
      displayFace = dice[0];
      gameLoop();
    }
  };

  function gameLoop() {
    gameStarted = true;

    console.log(game.currentPlayer);
  }

  function handleDiceRoll() {
    const rolledFace = game.rollDice();
    displayFace = rolledFace;
  }
</script>


<!-- Game loop -->
<div class="container flex flex-col h-full w-full m-auto items-center">
  <h1 class="m-10">LEGO® Race 3000 Virtual Dice</h1>
  {#if gameStarted}
    
    <!-- Face display -->
    <div class="mb-10">
      <FaceComponent pieces={displayFace} large={true}/>
    </div>

    <button 
      onclick={() => handleDiceRoll()}
      class="mb-10 p-4 bg-gray-200 rounded-lg hover:shadow-xl"
      >
      Roll
    </button>
    
    <DiceComponent faces={dice}/>
    

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
