<script>
  import { PLAYER_COLORS } from "$lib/types";
  import { PieceType, EmptyPiece, MovementPiece, SpecialPiece } from "$lib/types";
  
  let { pieces, large = false } = $props();
  
  let interactable = true;
</script>

<!-- Print face on its own -->
{#if large === true}
<div class="size-fit p-4 rounded-2xl bg-gray-900">
  <div class="grid grid-cols-2 grid-rows-2 shadow-[0_0_10px_0px]">
    {#each pieces as piece}
      {#if piece.type === PieceType.Empty}
        <div 
          class="size-16 shadow-md {piece.getColor()} {interactable ? 'hover:shadow-[0_0_5px_5px_red] hover:z-10' : ''}" 
        >
        </div>
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
    {#each pieces as piece}
      <div class="size-8 shadow-sm {piece.getColor()}"></div>
    {/each}
  </div>
</div>
{/if}