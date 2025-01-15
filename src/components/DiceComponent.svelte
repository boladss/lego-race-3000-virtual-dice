<script>
  import FaceComponent from "./FaceComponent.svelte";
  let { faces } = $props();
</script>

<div class="grid grid-cols-4 gap-1">
  <div class="col-span-2"></div>
  <FaceComponent pieces={ faces[0] } />
  <div class="col-span-1"></div>
  
  <FaceComponent pieces={ faces[1] } />
  <FaceComponent pieces={ faces[2] } />
  <FaceComponent pieces={ faces[3] } />
  <FaceComponent pieces={ faces[4] } />

  <div class="col-span-2"></div>
  <FaceComponent pieces={ faces[5] } />
  <div class="col-span-1"></div>
</div>