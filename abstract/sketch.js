let canvasHeight;
let noiseOffset = 0.0; // Initial offset for Perlin noise
let pixelGrid; // 2D array to store pixel values

function setup() {
  createCanvas(800, 800);
  background(0);
  canvasHeight = height; // Calculate canvas height multiplied by 25
  noiseSeed(42); // Set noise seed for consistency
  
  // Initialize the pixelGrid with canvas dimensions
  pixelGrid = new Array(width);
  for (let x = 0; x < width; x++) {
    pixelGrid[x] = new Array(canvasHeight);
  }
}

let counter = 0;
const stop = 1;

const NEIGHBOR_RADIUS = 1; // Adjust this radius as needed

function draw() {
  if (counter++ > stop) {
    noLoop();
    return;
  } else {
    counter++
  }

  loadPixels();
  // Populate the pixelGrid with pixel values
  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < width; x++) {
      pixelGrid[x][y] = color(pixels[getIndex(x, y)], pixels[getIndex(x, y) + 1], pixels[getIndex(x, y) + 2]);
    }
  }
  
  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < width; x++) {
      if (random(1) < 0.01) { // Randomly color some pixels
        pixelGrid[x][y] = color(random(1, 255), random(1, 255), random(1, 255)); // Random color
      } else {
        let neighbors = getNonBlackNeighbors(x, y);
        if (neighbors.length > 0) {
          let chosenIndex = neighbors[Math.floor(random(neighbors.length))];
          // Apply the chosen neighbor's color to the current pixel
          pixelGrid[x][y] = pixelGrid[chosenIndex % width][Math.floor(chosenIndex / width)];
        }
      }
    }
  }
  
  // Update the canvas pixels with the modified pixelGrid
  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < width; x++) {
      const index = getIndex(x, y);
      pixels[index] = red(pixelGrid[x][y]);
      pixels[index + 1] = green(pixelGrid[x][y]);
      pixels[index + 2] = blue(pixelGrid[x][y]);
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
        // Check if the neighbor is not black
        if (!isBlack(pixelGrid[nx][ny])) {
          neighbors.push(nx + ny * width);
        }
      }
    }
  }
  return neighbors;
}

function isBlack(col) {
  return red(col) === 0 && green(col) === 0 && blue(col) === 0;
}

function getIndex(x, y) {
  return (x+y * width) * 4;
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && mouseButton === LEFT) {
    saveCanvas('myCanvas', 'png');
  }
}
