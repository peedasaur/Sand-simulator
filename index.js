const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const resolution = 3;
const cols = width / resolution;
const rows = height / resolution;

const bgColor = "#000000";
window.brushColor = "#ffffff";
window.rainbowMode = false;
window.currHue = 200;

const velocityIncrementFactor = 0.2;

class Particle {
  constructor(type = "sand", color = bgColor) {
    this.type = type;
    this.color = color;
    this.empty = type === "empty";
    this.changed = true;
    this.velocity = 0;
  }

  isEmpty() {
    return this.empty;
  }

  update(type, color) {
    this.type = type;
    this.color = color;
    this.empty = type === "empty";
    this.changed = true;
    this.velocity = 0;
  }
}

let grid = createGrid(cols, rows);
let isMouseDown = false;

canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  addParticles(event);
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) addParticles(event);
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

function addParticles(event) {
  const x = Math.floor(event.offsetX / resolution);
  const y = Math.floor(event.offsetY / resolution);
  const extent = Math.floor(window.brushSize / 2);

  for (let i = y - extent; i <= y + extent; i++) {
    for (let j = x - extent; j <= x + extent; j++) {
      if (Math.random() > 0.75) continue;
      if (withinCols(j) && withinRows(i)) {
        let color = window.brushColor;

        if (window.rainbowMode) {
          color = HSLToRGB(window.currHue++);
          if (window.currHue >= 360) window.currHue = 0;
        }

        grid[i][j].update("sand", color);
      }
    }
  }
}

function withinCols(x) {
  return x >= 0 && x < cols;
}

function withinRows(y) {
  return y >= 0 && y < rows;
}

function createGrid(cols, rows) {
  const arr = [];
  for (let i = 0; i < rows; i++) {
    arr[i] = [];
    for (let j = 0; j < cols; j++) {
      arr[i][j] = new Particle("empty", bgColor);
    }
  }
  return arr;
}

function updateGrid() {
  for (let y = rows - 1; y >= 0; y--) {
    for (let x = 0; x < cols; x++) {
      const particle = grid[y][x];
      if (particle.isEmpty()) continue;

      if (withinRows(y + 1) && grid[y + 1][x].isEmpty()) {
        grid[y + 1][x].update(particle.type, particle.color);
        grid[y][x].update("empty", bgColor);
      } else {
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (
          withinCols(x + dir) &&
          withinRows(y + 1) &&
          grid[y + 1][x + dir].isEmpty()
        ) {
          grid[y + 1][x + dir].update(particle.type, particle.color);
          grid[y][x].update("empty", bgColor);
        }
      }
    }
  }
}

function renderGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x].changed) {
        ctx.fillStyle = grid[y][x].color;
        ctx.fillRect(x * resolution, y * resolution, resolution, resolution);
        grid[y][x].changed = false;
      }
    }
  }
}

function clearGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].update("empty", bgColor);
    }
  }
  ctx.clearRect(0, 0, width, height);
}

function HSLToRGB(h) {
  let s = 1,
    l = 0.5;
  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
  } else if (120 <= h && h < 180) {
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

function loop() {
  updateGrid();
  renderGrid();
  requestAnimationFrame(loop);
}

loop();
