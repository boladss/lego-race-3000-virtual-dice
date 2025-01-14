<script>
  import Face from "./Face.svelte";
  let { faces } = $props();
</script>

<div class="grid grid-cols-4 gap-1">
  <div class="col-span-2"></div>
  <Face pieces={ faces[0] } />
  <div class="col-span-1"></div>
  
  <Face pieces={ faces[1] } />
  <Face pieces={ faces[2] } />
  <Face pieces={ faces[3] } />
  <Face pieces={ faces[4] } />

  <div class="col-span-2"></div>
  <Face pieces={ faces[5] } />
  <div class="col-span-1"></div>
</div>