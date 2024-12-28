"use strict";

var bgnum = 1;
const backgroundContainer = document.querySelector('.bg-container');

backgroundContainer.querySelector('.more-btn').addEventListener('click', nextBgClick);
backgroundContainer.querySelector('.less-btn').addEventListener('click', prevBgClick);

function nextBgClick() {
  if (bgnum < 1) {
    bgnum++;
    backgroundContainer.querySelector('.label').innerHTML = bgnum;
    applyBg();
  }
}

function prevBgClick() {
  if (bgnum > 0) {
    bgnum--;
    backgroundContainer.querySelector('.label').innerHTML = bgnum;
    applyBg();
  }
}

function applyBg() {
  if (bgnum === 0) {
    document.querySelector('.boardbg').style.visibility = 'hidden';
  }
  else {
    document.querySelector('.boardbg').style.visibility = 'visible';
  }
}
