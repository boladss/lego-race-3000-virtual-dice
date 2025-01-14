<script>
  import Dice from "../components/dice.svelte";
  import Face from "../components/face.svelte";
  import { testDice } from "$lib/dice"

  const faces = testDice;
</script>


<div class="container flex flex-col h-full w-full m-auto items-center">
  <h1 class="m-10">LEGO® Race 3000 Virtual Dice</h1>
  
  <!-- Face display -->
  <div class="mb-10">
    <Face pieces={faces[0]} large={true}/>
  </div>

  <Dice faces={faces}/>

</div>
