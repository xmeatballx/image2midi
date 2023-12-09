export class ImageCanvas {
  canvas: HTMLCanvasElement;
  uiCanvas: HTMLCanvasElement;
  image: HTMLImageElement;
  cellSize: number;
  ctx: CanvasRenderingContext2D | null;
  uictx: CanvasRenderingContext2D | null;
  data: { r: number[]; g: number[]; b: number[] };
  animationDuration: number;
  animationStartTime: number;
  isAnimating: boolean;
  animationId: any;

  constructor(
    canvas: HTMLCanvasElement,
    uiCanvas: HTMLCanvasElement,
    rows: number,
    cols: number,
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.image = new Image();
    this.uiCanvas = uiCanvas;
    canvas.parentNode?.appendChild(this.uiCanvas);
    this.uictx = this.uiCanvas.getContext("2d");
    this.data = { r: [], g: [], b: [] };
    this.rows = rows;
    this.cols = cols;
  }

  attachImage(image: HTMLImageElement) {
    this.image = image;
  }

  getImage() {
    return this.image;
  }

  createLowResolutionGrid() {
    const width = this.image.width;
    const height = this.image.height;

    const cellWidth = this.canvas.width / this.rows;
    const cellHeight = this.canvas.height / this.cols;

    this.data.r = [];
    this.data.g = [];
    this.data.b = [];

    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        this.image,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );

      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const startX = col * cellWidth;
          const startY = row * cellHeight;

          const regionImageData = this.ctx.getImageData(
            startX,
            startY,
            cellWidth,
            cellHeight,
          );
          const averageColor = this.calculateAverageColor(regionImageData);

          this.data.r.push(averageColor.r);
          this.data.g.push(averageColor.g);
          this.data.b.push(averageColor.b);

          this.ctx.fillStyle = `rgb(${averageColor.r}, ${averageColor.g}, ${averageColor.b})`;
          this.ctx.fillRect(startX, startY, cellWidth, cellHeight);
          this.ctx.strokeStyle = "white";
          this.ctx.strokeRect(startX, startY, cellWidth, cellHeight);
        }
      }
    }
  }
  calculateAverageColor(imageData: ImageData) {
    const data = imageData.data;
    let sumR = 0,
      sumG = 0,
      sumB = 0;

    for (let i = 0; i < data.length; i += 4) {
      sumR += data[i];
      sumG += data[i + 1];
      sumB += data[i + 2];
    }

    const numPixels = data.length / 4;
    const averageColor = {
      r: Math.round(sumR / numPixels),
      g: Math.round(sumG / numPixels),
      b: Math.round(sumB / numPixels),
    };

    return averageColor;
  }

  initAnimations(duration: number) {
    this.animationDuration = duration;
    this.isAnimating = true;
  }
  drawCursor(index: number) {
    const cellWidth = this.uiCanvas.width / this.rows;
    const cellHeight = this.uiCanvas.height / this.cols;
    const x = cellWidth * (index % this.rows);
    const y = cellHeight * Math.floor(index / this.rows);
    if (this.uictx) {
      this.animationStartTime = performance.now();
      this.cursorFadeAnimation(x, y, cellWidth, cellHeight);
    }
  }

  private cursorFadeAnimation(
    x: number,
    y: number,
    cellWidth: number,
    cellHeight: number,
  ) {
    const currentTime = performance.now();
    const elapsed =
      ((currentTime - this.animationStartTime) % this.animationDuration) /
      this.animationDuration;
    if (elapsed < 0.1) {
      this.uictx.strokeStyle = `rgba(255, 0, 0, ${elapsed / 0.2})`;
    } else if (elapsed < 0.9) {
      this.uictx.strokeStyle = "red";
    } else if (elapsed < 1) {
      this.uictx.strokeStyle = `rgba(255, 0, 0, ${(1 - elapsed) / 0.2})`;
    }
    //if (elapsed < 0.01) {
    this.uictx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
    //}
    this.uictx.lineWidth = 8;
    this.uictx.strokeRect(x, y, cellWidth, cellHeight);
    this.animationId = requestAnimationFrame(() =>
      this.cursorFadeAnimation(x, y, cellWidth, cellHeight),
    );
    if (!this.isAnimating) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      this.uictx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
      this.uictx.strokeStyle = "red";
      this.uictx?.strokeRect(x, y, cellWidth, cellHeight);
    }
  }
}
