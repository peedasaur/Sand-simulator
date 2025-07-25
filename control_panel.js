const colorPicker = document.querySelector("#color-picker");
const brushSizeSlider = document.querySelector("#brush-size");
const clearBtn = document.querySelector("#clear-btn");
const rainbowCheckbox = document.querySelector("#rainbow-mode");

window.brushSize = parseInt(brushSizeSlider.value);
window.rainbowMode = false;
window.brushColor = colorPicker.value;

window.addEventListener("load", () => {
  colorPicker.value = "#ffffff";
  brushSizeSlider.value = 5;
  rainbowCheckbox.checked = false;
});

colorPicker.addEventListener("change", (event) => {
  window.brushColor = event.target.value;
});

rainbowCheckbox.addEventListener("change", (event) => {
  window.rainbowMode = rainbowCheckbox.checked;
});

brushSizeSlider.addEventListener("input", (event) => {
  window.brushSize = parseInt(event.target.value);
});

clearBtn.addEventListener("click", () => {
  clearGrid();
});

const year = document.querySelector(".year");
year.textContent = new Date().getFullYear();
