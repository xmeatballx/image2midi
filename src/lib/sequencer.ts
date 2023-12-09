import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

export class Sequencer {
  tempo: number;
  notes: number[];
  currentNoteIndex: number = 0;
  isPlaying: boolean = false;
  interval: any;
  store: Writable<any>;

  constructor(tempo: number, notes: number[]) {
    this.tempo = tempo;
    this.notes = notes;
    this.store = writable(this);
  }

  play() {
    this.isPlaying = true;
    if (!this.interval) {
      this.interval = setInterval(
        () => this.stepForward(),
        this.getBPMInMilliseconds(),
      );
    }
    this.store.set(this);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.interval);
    this.interval = null;
    this.store.set(this);
  }

  stop() {
    this.isPlaying = false;
    clearInterval(this.interval);
    this.interval = null;
    this.currentNoteIndex = 0;
    this.store.set(this);
  }

  stepForward() {
    if (this.currentNoteIndex < this.notes.length - 1) {
      this.currentNoteIndex++;
    } else {
      this.currentNoteIndex = 0;
    }
    this.store.set(this);
  }

  stepBackward() {
    if (this.currentNoteIndex > 0) this.currentNoteIndex--;
    else this.currentNoteIndex = this.notes.length - 1;
    this.store.set(this);
  }

  setNotes(notes: number[]) {
    this.notes = notes;
    this.store.set(this);
  }

  subscribe(subscriber: any) {
    return this.store.subscribe(subscriber);
  }

  getBPMInMilliseconds() {
    // tempo of 4 bpm   1 beat is 1/4 of 1 minute  aka 1 beat = 60000 * (1/tempo)
    return 60000 * (1 / this.tempo);
  }
}
