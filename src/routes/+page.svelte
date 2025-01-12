<script>
  import Face from "../components/face.svelte";

  const pieces = [
    { color: "blue" },
    { color: "red" },
    { color: "green" },
    { color: "white" },
  ]
</script>

<h1>LEGO® Race 3000 Virtual Dice</h1>

<Face pieces={pieces}/>