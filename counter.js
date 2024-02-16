class Updater {
    constructor(playerCountDisplay, roundsCountDisplay, playerNumber, roundNumber) {
        this.playerNumber = playerNumber;
        this.roundNumber = roundNumber;
        this.playerCountDisplay = playerCountDisplay;
        this.roundsCountDisplay = roundsCountDisplay;
        this.updateDisplay();
    }

    playerPlus() {
        if(this.playerNumber < 6){
            this.playerNumber += 1;
            this.updateDisplay();
        }
    }

    playerMinus() {
        if(this.playerNumber > 2){
            this.playerNumber -= 1;
            this.updateDisplay();
        }
    }

    roundPlus() {
        if(this.roundNumber < 30){
            this.roundNumber += 1;
            this.updateDisplay();
        }
    }

    roundMinus() {
        if(this.roundNumber > 3){
            this.roundNumber -= 1;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        this.playerCountDisplay.textContent = this.playerNumber;
        this.roundsCountDisplay.textContent = this.roundNumber;
    }
}

const minusPlayer = document.querySelector('[data-player-min]');
const plusPlayer = document.querySelector('[data-player-plus]');
const playerCountDisplay = document.querySelector('[data-player-count]');

const minusRounds = document.querySelector('[data-round-min]');
const plusRounds = document.querySelector('[data-round-plus]');
const roundsCountDisplay = document.querySelector('[data-round-count]');

let playerCount = 2;
let roundsCount = 5;
const updater = new Updater(playerCountDisplay, roundsCountDisplay, playerCount, roundsCount);

minusPlayer.addEventListener('click', () => {
    updater.playerMinus();
});

plusPlayer.addEventListener('click', () => {
    updater.playerPlus();
});

minusRounds.addEventListener('click', () => {
    updater.roundMinus();
});

plusRounds.addEventListener('click', () => {
    updater.roundPlus();
});