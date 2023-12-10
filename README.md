# Image2Midi

An experiment in using images as an arbitrary data source for generative midi.

When you upload in an image it is split into a grid
where each cell color represents the average color of the grid region.
From each of these grid cells, values like RGB channels and HSB values
can be mapped to midi parameters such as pitch, velocity, and timing.
It is built with SvelteKit, JS Canvas, and the web audio API.
