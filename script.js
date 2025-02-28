"use strict";

const body = document.querySelector('body');
const board = document.querySelector('.boardbg-out');
const optionsContainer = document.querySelector('.option-container');
const rotationDecrement = 1.01; // Speed decrement
const initialRotationIncrement = 24;
const throwingEnabled = true;
const movingEnabled = true;
let isAnimating = false;

board.addEventListener('click', handleCubeClick);
optionsContainer.addEventListener('click', handleOptionClick);

function handleOptionClick() {
  const menu = document.getElementsByClassName("menu")[0];
  if (menu.classList.contains("menu-opened")) {
    menu.getElementsByClassName("arrow")[0].classList.remove('rotate');
    menu.classList.remove("menu-opened");
    menu.classList.add("menu-closed");
  } 
  else if (menu.classList.contains("menu-closed")) {
    menu.getElementsByClassName("arrow")[0].classList.add('rotate');
    menu.classList.remove("menu-closed");
    menu.classList.add("menu-opened");
  }
}

function handleCubeClick() {
  var containers = document.querySelectorAll('.container:not(.hidden)');
  var numContainers = containers.length;

  for (let i = 0; i < numContainers; i++) {
    const element = containers[i];
    if (element.isAnimating) {
      return;
    }
  }

  for (let i = containers.length - 1; i >= numberOfDice; i--) {
    containers[i].remove();
  }

  for (let i = numContainers; i < numberOfDice; i++) {
    const divOrigin = document.querySelector('.container.hidden'); 
    const divClone = divOrigin.cloneNode(true);
    divClone.classList.remove("hidden"); 
    board.appendChild(divClone);
  }

  containers = document.querySelectorAll('.container:not(.hidden)');
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
  const cube = container.querySelector('.cube');

  const targetRotationX = currentRotationX + facesToRotate.x * 90;
  var targetRotationY = (currentRotationY + facesToRotate.y * 90);
  var targetRotationZ = (currentRotationZ + facesToRotate.z * 90);
  if (targetRotationX % 360 == 90 || targetRotationX % 360 == 270) {
    targetRotationY += Math.ceil(Math.random() * 85);
    targetRotationZ += 360 - currentRotationZ % 360;
  }
  if ((targetRotationX % 360 == 180 || targetRotationX % 360 == 0) && (targetRotationY % 360 == 180 || targetRotationY % 360 == 0)) {
    targetRotationZ += 10 + Math.ceil(Math.random() * 75);
    targetRotationY += 360 - currentRotationY % 360;
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
    if (current >= target)
    {
      ratio = 1;
    }
    var translateZ = throwingEnabled ? (ratio * -2000.0) + 800 : -1200;
    if (movingEnabled)
      animateMovement();
    if (currentRotationX < targetRotationX) currentRotationX += rotationIncrement;
    if (currentRotationY < targetRotationY) currentRotationY += rotationIncrement;
    if (currentRotationZ < targetRotationZ) currentRotationZ += rotationIncrement;
    cube.style.transform = `translateZ(${translateZ}px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) rotateZ(${currentRotationZ}deg)`;

    if (currentRotationX < targetRotationX || currentRotationY < targetRotationY || currentRotationZ < targetRotationZ) {
      requestAnimationFrame(animateRotation);
    } else {
      currentRotationX = targetRotationX % 360;
      currentRotationY = targetRotationY % 360;
      currentRotationZ = targetRotationZ % 360;
      cube.style.transform = `translateZ(${translateZ}px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) rotateZ(${currentRotationZ}deg)`;
      container.isAnimating = false;
    }

    // Decrease rotation speed
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
    var shadowDist = 20 + (80 -(ratio * 80));
    var shadow = container.querySelector('.scene').querySelector('.dice-shadow');
    shadow.style.boxShadow = '0px 0px ' + shadowDist + 'px 40px #000000ab';
    var shadowRotation = 0;
    if (targetRotationZ != 0 && targetRotationZ % 90 != 0) {
      shadowRotation = Math.abs(targetRotationZ % 360);
    }
    else if (targetRotationY != 0 && targetRotationY % 90 != 0) {
      shadowRotation = Math.abs(targetRotationY % 360);
    }
    
    if ((targetRotationX % 360 == 270 || (targetRotationX % 360 + targetRotationY % 360) == 180) && shadowRotation > 0) {
      // In those cases shadow has to be projected in opposite direction
      shadowRotation *= -1;
    }
    shadowRotation *= ratio;
    shadow.style.transform = 'rotateZ(' + shadowRotation + 'deg)';
  }
}
