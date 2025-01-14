<script>
  import Face from "../components/face.svelte";

  const pieces = [
    { color: "blue" },
    { color: "red" },
    { color: "green" },
    { color: "white" },
  ]
</script>


<div class="container flex flex-col h-full w-full m-auto items-center">
  <h1 class="m-10">LEGO® Race 3000 Virtual Dice</h1>
  
  <Face pieces={pieces}/>

</div>
