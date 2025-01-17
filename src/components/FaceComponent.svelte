<script lang="ts">
  import { Piece, PieceType } from "$lib/types";
  
  let { game, face = $bindable(), diceIndex, large = false } = $props();

  // Tailwind classes
  const containerLarge: string = 'size-fit p-4 rounded-2xl bg-gray-900';
  const containerSmall: string = 'size-fit p-2 rounded-xl bg-gray-900';
  const gridLarge: string = 'grid grid-cols-2 grid-rows-2 shadow-[0_0_10px_0px]' ;
  const gridSmall: string = 'grid grid-cols-2 grid-rows-2 shadow-[0_0_5px_0px]';
  const renderLarge: string = 'size-16 shadow-md';
  const renderSmall: string = 'size-8 shadow-sm';
  const hoverEffects: string = 'hover:shadow-[0_0_5px_5px_red] hover:z-10'

  // Handle event when player wants to replace a piece on the dice
  function selectPieceHandler( pieceIndex: number ) {
    switch (game.gameState) {
      case "init": {
        if (!game.currentSubPlayerPlacedPiece) {
          game.setDicePiece(game.currentPlayerSubturn, diceIndex, pieceIndex);
        } else alert("Already placed a piece!");
        return;
      }
      case "main": {
        if (game.checkPlayerPieces(game.currentPlayerTurn) && !game.currentPlayerPlacedPiece) {
          game.setDicePiece(game.currentPlayerTurn, diceIndex, pieceIndex);
        } else alert("No more pieces!");
        return;
      }
    }
  }

  // Check if empty pieces on the main face should still be editable
  function isValidEmptyPiece(piece: Piece): boolean {
    // Check if cell is an empty piece
    if (piece.type !== PieceType.Empty) return false;
    if (!game.currentPlayerRolled) return false;
    switch (game.gameState) {
      case "init": return !game.currentSubPlayerPlacedPiece;
      case "main": return !game.currentPlayerPlacedPiece;
      default: return false;
    }
  }
</script>

<!-- Print face on its own -->
{#if large === true}
<div class="{containerLarge}">
  <div class="{gridLarge}">
    <!-- TODO: Fix logic for rendering pieces -->
    {#each face as piece, pieceIndex}

      <!-- Rolling player can add their movement piece onto any empty piece on the rolled face -->
      {#if isValidEmptyPiece(piece)}
        <button onclick={() => selectPieceHandler(pieceIndex)} class="{renderLarge} {piece.getColor()} {hoverEffects}" aria-label="Piece">
        </button>
      {:else}
        <div class="{renderLarge} {piece.getColor()}">
        </div>
      {/if}
    {/each}
  </div>
</div>

<!-- Display all dice faces -->
{:else}
<div class="{containerSmall}">
  <div class="{gridSmall}">
    {#each face as piece}
      <div class="{renderSmall} {piece.getColor()}"></div>
    {/each}
  </div>
</div>
{/if}