// score


export class Score {

    constructor() {
        this.score = document.querySelector('.score');
        this.percentage = this.score.querySelector('.score__percentage');
        this.level = this.score.querySelector('.score__level');
    }

    addEventListeners() {
        this.resetPercentage();
    }

    resetPercentage() {
        this.percentage.textContent = '0% Complete';
    }
}