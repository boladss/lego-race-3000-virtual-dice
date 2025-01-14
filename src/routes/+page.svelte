<script>
  import Dice from "../components/Dice.svelte";
  import Face from "../components/Face.svelte";
  import { testDice } from "$lib/dice"

  const dice = testDice;
  
  let players = [];
  const playerColors = ["red", "green", "blue", "white"];
  
  let gameStarted = false;
  
  function configGame() {
    if (players.length > 0) {
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
      <Face pieces={dice[0]} large={true}/>
    </div>
    
    <Dice faces={dice}/>
    

  <!-- Start a new game -->
  {:else}
    <h2>Select Players</h2>

    <form class="flex flex-col items-start mt-4">

    {#each playerColors as color}
      <label class="flex items-center">
        <input type="checkbox" bind:group={players} value={color} />
        <span class="ml-2 text-{color}-500">{color.charAt(0).toUpperCase() + color.slice(1)}</span>
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
