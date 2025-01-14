<script>
  import Dice from "../components/dice.svelte";
  import Face from "../components/face.svelte";

  const faces = [
    [
      { color: "blue" },
      { color: "red" },
      { color: "green" },
      { color: "white" },
    ],
    [
      { color: "blue" },
      { color: "blue" },
      { color: "green" },
      { color: "white" },
    ],
    [
      { color: "blue" },
      { color: "red" },
      { color: "red" },
      { color: "white" },
    ],
    [
      { color: "blue" },
      { color: "red" },
      { color: "green" },
      { color: "green" },
    ],
    [
      { color: "white" },
      { color: "red" },
      { color: "green" },
      { color: "white" },
    ],
    [
      { color: "blue" },
      { color: "red" },
      { color: "green" },
      { color: "white" },
    ],
    [
      { color: "blue" },
      { color: "red" },
      { color: "green" },
      { color: "white" },
    ],
  ]
</script>


<div class="container flex flex-col h-full w-full m-auto items-center">
  <h1 class="m-10">LEGO® Race 3000 Virtual Dice</h1>
  
  <!-- Face display -->
  <div class="mb-10">
    <Face pieces={faces[0]} large={true}/>
  </div>

  <Dice faces={faces}/>

</div>
