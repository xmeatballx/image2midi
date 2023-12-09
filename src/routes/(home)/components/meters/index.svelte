<script lang="ts">
  export let sequencer;
  export let cursor = 0;
  export let data = { r: [0], g:[0], b: [0]};

  function getPercentage(input: number | undefined) {
    if (input) {
      return `${100-Math.floor(input/255*100)}%`
    } else {
      return "100%"
    }
  }
</script>

<div class="grid gap-1">
  <div>
    <div class="h-12 w-full relative mx-auto border-2 border-red-500 rounded">
      <div class="meter absolute inset-0 rounded bg-red-500 flex items-center border-2 border-red-500" style={`right: ${getPercentage(data?.r[cursor])}`}>
        <p class="font-bold px-3">{data?.r[cursor] ?? 0}</p>
      </div>
    </div>
  </div>
  <div>
    <div class="h-12 w-full relative mx-auto border-2 border-green-600 rounded">
      <div class="meter absolute inset-0 rounded bg-green-600 flex items-center border-2 border-green-600" style={`right: ${getPercentage(data?.g[cursor])}`}>
        <p class="font-bold px-3">{data?.g[cursor] ?? 0}</p>
      </div>
    </div>
  </div>
  <div>
    <div class="h-12 w-full relative mx-auto border-2 border-blue-600 rounded">
      <div class="meter absolute inset-0 rounded bg-blue-600 flex items-center border-2 border-blue-600" style={`right: ${getPercentage(data?.b[cursor])}`}>
        <p class="font-bold px-3">{data?.b[cursor] ?? 0}</p>
      </div>
    </div>
  </div>
</div>

<style>
.meter {
  transition: right .2s;
}
</style>
