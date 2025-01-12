<script>
  let { piece } = $props(); 
  let color = piece.color;
</script>

<div 
  class="size-10 rounded-xl shadow-md"
  style:background-color={color}
></div>