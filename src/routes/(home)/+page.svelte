<script lang="ts">
import { ImageCanvas } from '$lib/image_canvas'
import { Sequencer } from '$lib/sequencer'
import SequencerControls from "./components/sequencer_options/index.svelte";
import Tempo from './components/sequencer_options/tempo.svelte'
import PlayState from './components/sequencer_options/play_state.svelte'
import Meters from './components/meters/index.svelte'
import { FileDropzone } from '@skeletonlabs/skeleton'

let image, file, fileInput, canvas, uiCanvas, aspect, data;
let size = 512;
let start = 0;
let cols = 4;
let cursor = 0;

let imageCanvas;
let sequencer = new Sequencer(120, []);

function handleFileInput(e) {
  const uploadedImage = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(uploadedImage);
  reader.onload = e => {
    const ctx = canvas.getContext("2d");
    image = new Image();
    image.src = e.target.result;
    image.onload = e => {
      aspect = image.width / image.height;
      canvas.height = size / aspect;
      imageCanvas.attachImage(image);
      imageCanvas.createLowResolutionGrid();
      sequencer.setNotes(imageCanvas.data.r);
      resetImageCanvas();
    }
  }
}

function resetImageCanvas() {
  if (imageCanvas) {
    resetSequencer();
  }
}

function resetSequencer() {
  sequencer.stop();
  sequencer.play();
  imageCanvas.initAnimations(sequencer.getBPMInMilliseconds(sequencer.tempo));
}

function handleStartChange(e) {
  imageCanvas.drawCursor(e.target.value);
}

function handlePlay() {
  sequencer.play();
  imageCanvas.initAnimations(sequencer.getBPMInMilliseconds(sequencer.tempo));
}

function handlePause() {
  sequencer.pause();
  imageCanvas.isAnimating = false;
}

function handleStop() {
  sequencer.stop();
  imageCanvas.isAnimating = false;
  sequencer.currentNoteIndex = 0;
  imageCanvas.drawCursor(0);
}

$: if (canvas && !imageCanvas) {
  imageCanvas = new ImageCanvas(canvas, uiCanvas, cols, cols);
} 

$: if (imageCanvas && sequencer) {
  cursor = $sequencer.currentNoteIndex;
  data = imageCanvas.data;
  if (image && imageCanvas.isAnimating) imageCanvas.drawCursor(cursor);
} 

onDestroy: () => {
  sequencer.stop();
}

</script>

<FileDropzone on:change={handleFileInput}/>
<div class="editor">
  <div class="canvas_container">
    <img src="" width={size} height={size} class="absolute"/>
    <canvas bind:this={canvas}
	  	width={size} height={size}
			style={`width: ${size}px; height: ${size/aspect}px`}
    />
    <canvas bind:this={uiCanvas}
			width={size} height={size}
			style={`width: ${size}px; height: ${size/aspect}px`} 
      class="absolute"
    />
  </div>

  <div class="px-3 flex flex-col gap-6">
    <SequencerControls>
      <PlayState 
        onPlay={() => handlePlay()} 
        onPause={() => handlePause()}
        onStop={() => handleStop()}
        onStepForward={() => sequencer.stepForward()}
        onStepBackward={() => sequencer.stepBackward()}
      />
      <Tempo sequencer={sequencer} changeHandler={() => resetSequencer()}/>
    </SequencerControls>
    <Meters sequencer={sequencer} data={data} cursor={cursor}/>
  </div>
</div>

<style>
.controls_container {
  padding: 1em;
}

.canvas_container {
  position: relative;
}

.absolute {
  position: absolute;
  inset: 0;
}

.editor {
  display: grid;
  grid-template-columns: 512px 512px;
}
</style>
