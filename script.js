"use strict";

const body = document.querySelector('body');
const board = document.querySelector('.board');
const optionsContainer = document.querySelector('.option-container');
const numberOfDicesContainer = document.querySelector('.number-of-dices-container');
const rotationDecrement = 1.01; // Speed decrement
const initialRotationIncrement = 24;
const throwingEnabled = true;
const movingEnabled = true;
var numberOfDices = 1;
let isAnimating = false;

board.addEventListener('click', handleCubeClick);
optionsContainer.addEventListener('click', handleOptionClick);
numberOfDicesContainer.querySelector('.more').addEventListener('click', moreDicesClick);
numberOfDicesContainer.querySelector('.less').addEventListener('click', lessDicesClick);

function moreDicesClick() {
  if (numberOfDices<10) {
    numberOfDices++;
    numberOfDicesContainer.querySelector('.label').innerHTML = numberOfDices;
  }
}

function lessDicesClick() {
  if (numberOfDices>0) {
    numberOfDices--;
    numberOfDicesContainer.querySelector('.label').innerHTML = numberOfDices;
  }
}

function handleOptionClick() {
  const menu = document.getElementsByClassName("menu")[0];
  if (menu.classList.contains("menu-opened"))
  {
    menu.getElementsByClassName("arrow")[0].classList.remove('rotate');
    menu.classList.remove("menu-opened");
    menu.classList.add("menu-closed");
  } 
  else if (menu.classList.contains("menu-closed"))
  {
    menu.getElementsByClassName("arrow")[0].classList.add('rotate');
    menu.classList.remove("menu-closed");
    menu.classList.add("menu-opened");
  }
}

function handleCubeClick() {
  
  var containers = document.getElementsByClassName("container");
  var numContainers = containers.length;

  for (let i = 0; i < numContainers; i++) {
    const element = containers[i];
    if (element.isAnimating) {
      return; // Abort if any animation is already running
    }
  }
  
  for (let i = containers.length - 1; i > numberOfDices; i--) {
    containers[i].remove();
  }

  for (let i = numContainers; i<=numberOfDices; i++)
  {
    const divOrigin = document.getElementsByClassName("container")[0];
    const divClone = divOrigin.cloneNode(true);
    divClone.classList.remove("hidden");
    board.appendChild(divClone);
  }

  containers = document.getElementsByClassName("container");
  numContainers = containers.length;
  const targetPositions = generateTargetPositions(numContainers);

  for (let i = 0; i < numContainers; i++) {
    const element = containers[i];
    const targetPosition = targetPositions[i];
    const facesToRotate = calculateFacesToRotate();
    element.isAnimating = true;
    animate(facesToRotate, element, targetPosition);
  }
}

function generateTargetPositions(numContainers) {
  const targetPositions = [];
  const containerWidth = document.getElementsByClassName("container")[0].offsetWidth;
  const containerHeight = document.getElementsByClassName("container")[0].offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  for (let i = 0; i <= numContainers; i++) {
    let targetTranslateX, targetTranslateY;
    let overlapping = false;

    do {
      targetTranslateX = Math.floor(Math.random() * (windowWidth - containerWidth*2)+containerWidth);
      targetTranslateY = Math.floor(Math.random() * (windowHeight - containerHeight*2)+containerHeight);
      overlapping = checkOverlap(targetTranslateX, targetTranslateY, containerWidth, containerHeight, targetPositions, i);
    } while (overlapping);

    targetPositions.push({ x: targetTranslateX, y: targetTranslateY });
  }

  return targetPositions;
}

function checkOverlap(targetTranslateX, targetTranslateY, containerWidth, containerHeight, targetPositions, currentIndex) {
  for (let i = 0; i < currentIndex; i++) {
    const position = targetPositions[i];
    const left1 = targetTranslateX;
    const right1 = targetTranslateX + containerWidth;
    const top1 = targetTranslateY;
    const bottom1 = targetTranslateY + containerHeight;

    const left2 = position.x;
    const right2 = position.x + containerWidth;
    const top2 = position.y;
    const bottom2 = position.y + containerHeight;

    if (left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2) {
      return true; // Overlapping detected
    }
  }

  return false; // No overlapping
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

function animate(facesToRotate, container, targetPosition) {
  let rotationIncrement = initialRotationIncrement;
  let currentRotationX = 0;
  let currentRotationY = 0;
  let currentRotationZ = 0;
  let currentTranslateX = 0;
  let currentTranslateY = 0;
  let startTranslateX = 0;
  let startTranslateY = 0;
  let ratio = 0;
  let animationId = 0;
  const cube = container.querySelector('.cube');

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

  const targetTranslateX = targetPosition.x;
  const targetTranslateY = targetPosition.y;
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
    } else {
      current = currentRotationY;
      target = targetRotationY;
    }
    ratio = current / target;
    var translateZ = throwingEnabled ? (ratio * -2000.0) + 800 : -1200;
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
      container.isAnimating = false;
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
