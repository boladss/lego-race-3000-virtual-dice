<script lang="ts">
  import { PieceType, type GamePiece } from "$lib/types";
  
  let { game, face = $bindable(), large = false } = $props();
  
  let interactable = true;

  function selectPieceHandler(piece: GamePiece, pieceIndex: number) {
    console.log(`PIECE:${piece} ${pieceIndex}`);
    if (game.checkPlayerPieces(game.currentPlayer)) {
      game.replacePieceOnCurrentFace(pieceIndex);
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
    {#each face as piece, index}
      {#if piece.type === PieceType.Empty}
        <button 
          onclick={() => selectPieceHandler(piece, index)}
          class="size-16 shadow-md {piece.getColor()} {interactable ? 'hover:shadow-[0_0_5px_5px_red] hover:z-10' : ''}" 
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