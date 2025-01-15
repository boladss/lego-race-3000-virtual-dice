<script>
  import FaceComponent from "./FaceComponent.svelte";
  let { game } = $props();
</script>

<div class="grid grid-cols-4 gap-1">
  <div class="col-span-2"></div>
  <FaceComponent game={game} index={0} />
  <div class="col-span-1"></div>
  
  <FaceComponent game={game} index={1} />
  <FaceComponent game={game} index={2} />
  <FaceComponent game={game} index={3} />
  <FaceComponent game={game} index={4} />

  <div class="col-span-2"></div>
  <FaceComponent game={game} index={5} />
  <div class="col-span-1"></div>
</div>