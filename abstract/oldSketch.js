let canvasHeight;
let noiseOffset = 0.0; // Initial offset for Perlin noise

function setup() {
  createCanvas(800, 800);
  background(0);
  canvasHeight = height; // Calculate canvas height multiplied by 25
  noiseSeed(42); // Set noise seed for consistency
}

let counter = 0;
const stop = 1;

const NEIGHBOR_RADIUS = 1; // Adjust this radius as needed

function draw() {
  if (counter++ > stop) {
    noLoop();
    return;
  } else {
    counter++;
  }

  loadPixels();
  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < width; x++) {
      const index = getIndex(x, y);
      if (random(1) < 0.01) { // Randomly color some pixels
        pixels[index] = random(1, 255); // Random Red
        pixels[index + 1] = random(1, 255); // Random Green
        pixels[index + 2] = random(1, 255); // Random Blue
      } else {
        let neighbors = getNonBlackNeighbors(x, y);
        if (neighbors.length > 0) {
          let chosenIndex = neighbors[Math.floor(random(neighbors.length))];
          // Apply the chosen neighbor's color to the current pixel
          pixels[index] = pixels[chosenIndex];
          pixels[index + 1] = pixels[chosenIndex + 1];
          pixels[index + 2] = pixels[chosenIndex + 2];
        }
      }
    }
  }
  updatePixels();

  noiseOffset += 0.01; // Increment the noise offset for variation in subsequent frames
}

function getNonBlackNeighbors(x, y) {
  let neighbors = [];
  for (let dx = -NEIGHBOR_RADIUS; dx <= NEIGHBOR_RADIUS; dx++) {
    for (let dy = -NEIGHBOR_RADIUS; dy <= NEIGHBOR_RADIUS; dy++) {
      let nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < canvasHeight && (dx !== 0 || dy !== 0)) {
        let idx = getIndex(nx, ny);
        // Check if the neighbor is not black
        if (!(pixels[idx] === 0 && pixels[idx + 1] === 0 && pixels[idx + 2] === 0)) {
          neighbors.push(idx);
        }
      }
    }
  }
  return neighbors;
}



function getIndex(x, y) {
  return (x + y * width)*4;
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && mouseButton === LEFT) {
    saveCanvas('myCanvas', 'png');
  }
}