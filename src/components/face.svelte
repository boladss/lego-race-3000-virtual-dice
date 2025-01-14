<script>
  let { pieces } = $props();
</script>

<div class="size-fit p-4 rounded-2xl bg-gray-900">
  <div class="grid grid-cols-2 grid-rows-2 shadow-[0_0_10px_0px]">
    <div class="size-16 shadow-md" style:background-color={pieces[0].color}></div>
    <div class="size-16 shadow-md" style:background-color={pieces[1].color}></div>
    <div class="size-16 shadow-md" style:background-color={pieces[2].color}></div>
    <div class="size-16 shadow-md" style:background-color={pieces[3].color}></div>
  </div>
</div>