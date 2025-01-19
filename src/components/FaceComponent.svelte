<script lang="ts">
  import { Piece, PieceType } from "$lib/types";
  import { TOTAL_MOVEMENT_PIECES, MovementPiece, Player } from "../routes/+page.svelte";
  
  let { game, face = $bindable(), diceIndex, large = false } = $props();

  // Tailwind classes
  const containerLarge: string = 'size-fit p-4 rounded-2xl bg-gray-900';
  const containerSmall: string = 'size-fit p-2 rounded-xl bg-gray-900';
  const gridLarge: string = 'grid grid-cols-2 grid-rows-2 shadow-[0_0_10px_0px]' ;
  const gridSmall: string = 'grid grid-cols-2 grid-rows-2 shadow-[0_0_5px_0px]';
  const renderLarge: string = 'size-16 shadow-md';
  const renderSmall: string = 'size-8 shadow-sm';
  const hoverEffects: string = 'hover:shadow-[0_0_5px_5px_red] hover:z-10';
  const highlightEffects: string = 'shadow-[0_0_5px_3px_red] z-10';

  // Handle event when player wants to replace a piece on the dice
  function selectPieceHandler( pieceIndex: number ) {
    switch (game.gameState) {
      case "init": {
        if (!game.currentPlayerInitialPiece) {
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

  // Remove one of your own pieces from the board (oil slick)
  function removePieceHandler( pieceIndex: number ): void {
    if (!game.oilSlickRemovedPiece) {
      game.setDicePiece(game.currentPlayerSubturn, diceIndex, pieceIndex, "oil");
    } else alert("Already removed a piece!");
    return;
  }

  // Replace a player's piece from the board
  function replacePieceHandler( pieceIndex: number, replacedPlayer: Player ): void {
    if (!game.checkPlayerPieces(game.currentPlayerTurn)) alert("No more pieces!");

    //  Find player whose piece is going to be replaced
    const replacedPlayerIndex = game.players.indexOf(replacedPlayer);

    if (!game.pitStopReplacedPiece) {
      if (noOtherPiecesOnBoard()) game.setDicePiece(game.currentPlayerSubturn, diceIndex, pieceIndex);
      else game.setDicePiece(game.currentPlayerSubturn, diceIndex, pieceIndex, "pit", replacedPlayerIndex);
    } else alert("Already replaced a piece!");
    return;
  }

  // Check if empty pieces on the main face should still be editable
  function isValidEmptyPiece(piece: Piece): boolean {
    // Check if cell is an empty piece
    if (piece.type !== PieceType.Empty) return false;
    if (!game.currentPlayerRolled) return false;
    switch (game.gameState) {
      case "init": return !game.currentPlayerInitialPiece;
      case "main": return !game.currentPlayerPlacedPiece;
      default: return false;
    }
  }

  function isValidOilSlickPiece(piece: Piece): boolean {
    // Check if movement tile is own player's tile --- can be removed when hitting an oil slick
    if (piece.type !== PieceType.Movement) return false;
    // Hack to resolve the issue with seemingly importing the MovementPiece class from +page.svelte
    if (piece.constructor.name === "MovementPiece") Object.setPrototypeOf(piece, MovementPiece.prototype);
    // Update UI if valid piece
    if (piece instanceof MovementPiece) return piece.player === game.players[game.currentPlayerSubturn];
    return false;
  }

  function noOtherPiecesOnBoard(): boolean {
    const otherPlayers = game.players.filter((player: Player) => player !== game.players[game.currentPlayerSubturn]);
    return otherPlayers.every((player: Player) => player.piecesLeft === TOTAL_MOVEMENT_PIECES);
  }

  function isValidPitPiece(piece: Piece): boolean {
    // Check first if there exist other players' pieces on the board
    // If all players' inventories are full, let the pit stopper place on any empty face
    const clearDice = noOtherPiecesOnBoard();

    if (clearDice) {
      if (piece.type !== PieceType.Empty) return false;
      return true;
    } else {
      // Pretty much the same as isValidOilSlickPiece(), but highlights pieces other than the player's own
      if (piece.type !== PieceType.Movement) return false;
      if (piece.constructor.name === "MovementPiece") Object.setPrototypeOf(piece, MovementPiece.prototype);
      if (piece instanceof MovementPiece) return piece.player !== game.players[game.currentPlayerSubturn];
      return false;
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
        <div class="{renderLarge} {piece.getColor()}"></div>
      {/if}
    {/each}
  </div>
</div>

<!-- Display all dice faces -->
{:else}
<div class="{containerSmall}">
  <div class="{gridSmall}">
    {#each face as piece, pieceIndex}
      <!-- Highlight pieces during an oil slick -->
      {#if (game.turnState === "oil") && isValidOilSlickPiece(piece)}
        <button onclick={() => removePieceHandler(pieceIndex)} class="{renderSmall} {piece.getColor()} {highlightEffects} {hoverEffects}" aria-label="Piece">
        </button>

      <!-- Highlight pieces during a pit stop -->
      {:else if (game.turnState === "pit") && (game.pitStopMode === 1) && isValidPitPiece(piece)}
        <button onclick={() => replacePieceHandler(pieceIndex, piece.player)} class="{renderSmall} {piece.getColor()} {highlightEffects} {hoverEffects}" aria-label="Piece">
        </button>
      {:else}
        <div class="{renderSmall} {piece.getColor()}"></div>
      {/if}
    {/each}
  </div>
</div>
{/if}