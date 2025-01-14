<script>
  let { pieces, large = false } = $props();
</script>

<!-- Print face on its own -->
{#if large === true}
<div class="size-fit p-4 rounded-2xl bg-gray-900">
  <div class="grid grid-cols-2 grid-rows-2 shadow-[0_0_10px_0px]">
    {#each pieces as piece}
      <div class="size-16 shadow-md" style:background-color={piece.color}></div>
    {/each}
  </div>
</div>

<!-- Display all dice faces -->
{:else}
<div class="size-fit p-2 rounded-xl bg-gray-900">
  <div class="grid grid-cols-2 grid-rows-2 shadow-[0_0_5px_0px]">
    {#each pieces as piece}
      <div class="size-8 shadow-sm" style:background-color={piece.color}></div>
    {/each}
  </div>
</div>
{/if}