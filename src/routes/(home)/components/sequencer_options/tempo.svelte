<script>
  export let sequencer, changeHandler;
</script>

<div class="h-fit -mt-6">
  <label for="tempo" class="relative top-3 w-fit ml-3 px-1 z-10">Tempo</label>
  <input type="number" id="tempo" bind:value={$sequencer.tempo} on:change={changeHandler} class="input pl-4" />
</div>

