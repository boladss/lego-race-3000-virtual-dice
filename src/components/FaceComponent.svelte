<script lang="ts">
  import { PieceType } from "$lib/types";
  
  let { game, face = $bindable(), diceIndex, large = false } = $props();
  
  let interactable = true;

  // Handle event when player wants to replace a piece on the dice
  function selectPieceHandler( pieceIndex: number ) {
    if (game.checkPlayerPieces(game.currentPlayerTurn) && !game.currentPlayerPlacedPiece) {
      game.setDicePiece(game.currentPlayerTurn, diceIndex, pieceIndex);
      game.currentPlayerPlacedPiece = true;
    } else {
      alert("No more pieces!");
    }
  }
</script>

<!-- Print face on its own -->
{#if large === true}
<div class="size-fit p-4 rounded-2xl bg-gray-900">
  <div class="grid grid-cols-2 grid-rows-2 shadow-[0_0_10px_0px]">
    <!-- TODO: Fix logic for rendering pieces -->
    {#each face as piece, pieceIndex}
      {#if ((piece.type === PieceType.Empty) && game.currentPlayerRolled)}
        <button 
          onclick={() => selectPieceHandler(pieceIndex)}
          class="size-16 shadow-md {piece.getColor()} {game.currentPlayerRolled ? 'hover:shadow-[0_0_5px_5px_red] hover:z-10' : ''}" 
          aria-label="Piece"
        >
        </button>
      {:else}
        <div 
          class="size-16 shadow-md {piece.getColor()}" 
        >
        </div>
      {/if}
    {/each}
  </div>
</div>

<!-- Display all dice faces -->
{:else}
<div class="size-fit p-2 rounded-xl bg-gray-900">
  <div class="grid grid-cols-2 grid-rows-2 shadow-[0_0_5px_0px]">
    {#each face as piece}
      <div class="size-8 shadow-sm {piece.getColor()}"></div>
    {/each}
  </div>
</div>
{/if}