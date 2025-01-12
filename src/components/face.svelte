<script>
  import Piece from "./piece.svelte";
  let { pieces } = $props();
</script>

<!-- <div class="size-32 bg-black content-center align-middle justify-center"> -->
<div class="size-fit bg-black p-2 rounded-xl">
  <div class="grid grid-cols-2 gap-2">
    <Piece piece={pieces[0]} />
    <Piece piece={pieces[1]} />
    <Piece piece={pieces[2]} />
    <Piece piece={pieces[3]} />
  </div>
</div>