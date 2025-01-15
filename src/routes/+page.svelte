<script lang="ts">
  import DiceComponent from "../components/DiceComponent.svelte";
  import FaceComponent from "../components/FaceComponent.svelte";
  import { PLAYER_NAMES, PLAYER_COLORS, Player, Race3000Game } from "$lib/types"
  import { type Dice, type Face, type GamePiece, EmptyPiece } from "$lib/types";

  let dice: Dice = [];
  
  let selectedPlayers: string[] = [];
  
  let gameStarted = false;
  
  function configGame() {
    if (selectedPlayers.length > 0) {
      // Generate players from checklist
      let players: Player[] = [];
      for (let playerColor of selectedPlayers) {
        // Create new player with 7 pieces (default)
        let player = new Player(playerColor, 7);
        players.push(player);
      }
      console.log(players);

      // Generate dice faces
      for (let i = 0; i < 6; i++) {
        let face: Face = [];

        for (let j = 0; j < 4; j++) {
          let emptyPiece: GamePiece = new EmptyPiece();
          face.push(emptyPiece);
        }

        dice.push(face);
      }
      console.log(dice);

      let game = new Race3000Game(players, dice);
      gameStarted = true;
    }
  };
</script>


<!-- Game loop -->
<div class="container flex flex-col h-full w-full m-auto items-center">
  <h1 class="m-10">LEGO® Race 3000 Virtual Dice</h1>
  {#if gameStarted}
    
    <!-- Face display -->
    <div class="mb-10">
      <FaceComponent pieces={dice[0]} large={true}/>
    </div>
    
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
