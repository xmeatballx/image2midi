<script>
  import PlayIcon from "$lib/assets/play.svg"
  import PauseIcon from "$lib/assets/pause.svg"
  import StopIcon from "$lib/assets/stop.svg"
  import StepIcon from "$lib/assets/step.svg"
  export let onPlay, onPause, onStop, onStepForward, onStepBackward;
</script>

<button type="button" on:click={() => onPlay()}><img src={PlayIcon} class="w-12"/></button>
<button type="button" on:click={() => onPause()}><img src={PauseIcon} class="w-12"/></button>
<button type="button" on:click={() => onStop()}><img src={StopIcon} class="w-12"/></button>
<button type="button" on:click={() => onStepBackward()}><img src={StepIcon} class="w-12"/></button>
<button type="button" on:click={() => onStepForward()}><img src={StepIcon} class="w-12 rotate-180"/></button>

<style>
img {
  opacity: 0.8;
}
</style>
