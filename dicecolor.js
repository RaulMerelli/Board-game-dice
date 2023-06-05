"use strict";

const colors = ['#E0151A', '#048E39', '#024492', '#D2B102', '#6F19CE', '#FF2E01', '#3A4044', '#EEE0D3'];
const colorOfDiceContainer = document.querySelector('.color-of-dice-container');
const colorPreview = colorOfDiceContainer.querySelector('.color-preview');
const prevButton = colorOfDiceContainer.querySelector('.prev-btn');
const nextButton = colorOfDiceContainer.querySelector('.next-btn');
let currentIndex = 0;

function updateColorPreview() {
  const color = colors[currentIndex];
  colorPreview.style.backgroundColor = color;
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  setColor(r, g, b);
}

prevButton.addEventListener('click', function() {
  currentIndex = (currentIndex - 1 + colors.length) % colors.length;
  updateColorPreview();
});

nextButton.addEventListener('click', function() {
  currentIndex = (currentIndex + 1) % colors.length;
  updateColorPreview();
});

updateColorPreview();

function setColor(r, g, b) {
    var root = document.querySelector(':root');
  
    let faceColor1 = "rgba(" + Math.trunc(r) + ", " + Math.trunc(g) + ", " + Math.trunc(b) + ", 1)";
    let faceColor2 = "rgba(" + Math.trunc(r * 0.9) + ", " + Math.trunc(g * 0.9) + ", " + Math.trunc(b * 0.9) + ", 1)";
    let faceColor3 = "rgba(" + Math.trunc(r * 0.65) + ", " + Math.trunc(g * 0.65) + ", " + Math.trunc(b * 0.65) + ", 1)";
    let innerFaceColor1 = "rgba(" + Math.trunc(r * 0.75) + ", " + Math.trunc(g * 0.75) + ", " + Math.trunc(b * 0.75) + ", 1)";
    root.style.setProperty('--face-color1', faceColor1);
    root.style.setProperty('--face-color2', faceColor2);
    root.style.setProperty('--face-color3', faceColor3);
    root.style.setProperty('--inner-face-color1', innerFaceColor1);
  
    var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance > 0.5) {
      root.style.setProperty('--dot-color1', '#000000');
      root.style.setProperty('--dot-color2', '#1A1A1A');
      root.style.setProperty('--dot-color3', '#5C5C5C');
    }
    else {
      root.style.setProperty('--dot-color1', '#FFFFFF');
      root.style.setProperty('--dot-color2', '#E5E5E5');
      root.style.setProperty('--dot-color3', '#A3A3A3');
    }
  }