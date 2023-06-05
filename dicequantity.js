"use strict";

var numberOfDice = 1;
const numberOfDiceContainer = document.querySelector('.number-of-dice-container');

numberOfDiceContainer.querySelector('.more-btn').addEventListener('click', moreDiceClick);
numberOfDiceContainer.querySelector('.less-btn').addEventListener('click', lessDiceClick);

function moreDiceClick() {
  if (numberOfDice < 10) {
    numberOfDice++;
    numberOfDiceContainer.querySelector('.label').innerHTML = numberOfDice;
  }
}

function lessDiceClick() {
  if (numberOfDice > 1) {
    numberOfDice--;
    numberOfDiceContainer.querySelector('.label').innerHTML = numberOfDice;
  }
}
