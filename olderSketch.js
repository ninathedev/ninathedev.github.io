function setup() {
  createCanvas(800, 800);
  background(0); // Start with a white background
}
let counter = 0;
const stop = 1;
function draw() {
  if (counter++ > stop) {
    noLoop();
    return;
  } else {
    counter++;
  }
  randomSeed(random(1,100)+3);
  loadPixels();
  // Color a random number of pixels with random colors
  for (let y = 0; y < height*25; y++) {
    for (let x = 0; x < width; x++) {
      if (random(1) < 0.003) { // Randomly color some pixels
        const index = getIndex(x, y);
        pixels[index] = random(1, 255); // Random Red
        pixels[index + 1] = random(1, 255); // Random Green
        pixels[index + 2] = random(1, 255); // Random Blue
      }
    }
  }

  // Iterate over each pixel to modify based on non-black neighbors
  for (let y = 0; y < height*25; y++) {
    for (let x = 0; x < width; x++) {
      const index = getIndex(x, y);
      let neighbors = getNonBlackNeighbors(x, y);
        if (neighbors.length > 0) {
          // Choose a random non-black neighbor
          randomSeed(random(1,100));
          if (random(1,100) < 99) {
            let chosenIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
            // Apply the chosen neighbor's color to the current pixel
            pixels[index] = pixels[chosenIndex];
            pixels[index + 1] = pixels[chosenIndex + 1];
            pixels[index + 2] = pixels[chosenIndex + 2];
            // Alpha (pixels[index + 3]) is left unchanged
          } else {
            // Choose a random color
            pixels[index] = random(1, 255); // Random Red
            pixels[index + 1] = random(1, 255); // Random Green
            pixels[index + 2] = random(1, 255); // Random Blue
          }
        }
    }
  }
  updatePixels();
}

function getIndex(x, y) {
  return (x+y * width) * 4;
}

function getNonBlackNeighbors(x, y) {
  randomSeed(random(1,100)+2);
  let neighbors = [];
  // Check each neighbor and add if not black
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
    let nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < width && ny >= 0 && ny < height*25) {
      let idx = getIndex(nx, ny);
      if (!(pixels[idx] === 0 && pixels[idx + 1] === 0 && pixels[idx + 2] === 0)) {
        neighbors.push(idx);
      }
    }
  });
  return neighbors;
}