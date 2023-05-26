"use strict";

const cube = document.querySelector('.cube');
const container = document.querySelector('.container');
const body = document.querySelector('body');
let rotationIncrement = 0;
const rotationDecrement = 1.01; // Speed decrement
const throwingEnabled = true;
const movingEnabled = true;
let animationId = null;
let currentRotationX = 0;
let currentRotationY = 0;
let currentRotationZ = 0;
let currentTranslateX = 0;
let currentTranslateY = 0;
let startTranslateX = 0;
let startTranslateY = 0;
let isAnimating = false;
let ratio = 0;

body.addEventListener('click', handleCubeClick);

function handleCubeClick() {
  if (!isAnimating) {
    rotationIncrement = 24; // Set rotation speed
    isAnimating = true;
    const facesToRotate = calculateFacesToRotate();
    animate(facesToRotate);
  }
}

function calculateFacesToRotate() {
  const facesToRotateX = Math.ceil(Math.random() * 12); // Random number between 1 and 12
  const facesToRotateY = Math.ceil(Math.random() * 12); // Random number between 1 and 12
  const facesToRotateZ = Math.ceil(Math.random() * 12); // Random number between 1 and 12
  return {
    x: facesToRotateX,
    y: facesToRotateY,
    z: facesToRotateZ,
  };
}

function animate(facesToRotate) {
  const targetRotationX = currentRotationX + facesToRotate.x * 90;
  var targetRotationY = (currentRotationY + facesToRotate.y * 90);
  var targetRotationZ = (currentRotationZ + facesToRotate.z * 90);
  if (targetRotationX%360==90 || targetRotationX%360==270) 
  {
    targetRotationY += Math.ceil(Math.random() * 85);
    targetRotationZ += 360 - currentRotationZ%360;
  }
  if (targetRotationX%360==180 || targetRotationX%360==0) 
  {
    currentRotationZ += Math.ceil(Math.random() * 85);
    targetRotationY += 360 - currentRotationY%360;
  }
  const targetTranslateX = Math.floor(Math.random() * (window.innerWidth - 200)) + 100;
  const targetTranslateY = Math.floor(Math.random() * (window.innerHeight - 200)) + 100;
  startTranslateX = container.offsetLeft;
  startTranslateY = container.offsetTop;

  animateRotation();

  function animateRotation() {
    var current;
    var target;
    if (facesToRotate.x > facesToRotate.y && facesToRotate.x > facesToRotate.z) {
      current = currentRotationX;
      target = targetRotationX;
    } else if (facesToRotate.z > facesToRotate.y && facesToRotate.z > facesToRotate.x) {
      current = currentRotationZ;
      target = targetRotationZ;
    } else  {
      current = currentRotationY;
      target = targetRotationY;
    }
    ratio = current / target;
    var translateZ = throwingEnabled?(ratio*-2000.0)+800:-1200;
    if (movingEnabled) 
      animateMovement();
    if (currentRotationX < targetRotationX) currentRotationX += rotationIncrement;
    if (currentRotationY < targetRotationY) currentRotationY += rotationIncrement;
    if (currentRotationZ < targetRotationZ) currentRotationZ += rotationIncrement;
    cube.style.transform = `translateZ(${translateZ}px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) rotateZ(${currentRotationZ}deg)`;

    if (
      currentRotationX < targetRotationX ||
      currentRotationY < targetRotationY ||
      currentRotationZ < targetRotationZ
    ) {
      animationId = requestAnimationFrame(animateRotation);
    } else {
      currentRotationX = targetRotationX % 360;
      currentRotationY = targetRotationY % 360;
      currentRotationZ = targetRotationZ % 360;
      cube.style.transform = `translateZ(${translateZ}px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) rotateZ(${currentRotationZ}deg)`;
      isAnimating = false;
      // Delay before allowing subsequent clicks
      setTimeout(() => {
        isAnimating = false;
      }, 100);
    }

      // Gradually decrease rotation speed
      if (rotationIncrement / rotationDecrement > 16) {
        rotationIncrement /= rotationDecrement;
      }
  }
  
  function animateMovement() {
    const translateXDiff = targetTranslateX - startTranslateX;
    const translateYDiff = targetTranslateY - startTranslateY;
    currentTranslateX = ratio * translateXDiff + startTranslateX;
    currentTranslateY = ratio * translateYDiff + startTranslateY;
    container.style.left = `${currentTranslateX}px`;
    container.style.top = `${currentTranslateY}px`;
  }
}