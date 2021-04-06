// score


export class Score {

    constructor(pages) {
        this.score = document.querySelector('.score');
        this.percentage = this.score.querySelector('.score__percentage');
        this.level = this.score.querySelector('.score__level');
        this.pagesContainer = pages;
        this.numberOfElements = 61;
        this.completeText = '% Complete';
    }

    addEventListeners() {
        this.resetPercentage();
    }

    resetPercentage() {
        this.percentage.textContent = 0 + this.completeText;
    }

    updateScore() {
        var numberOfValidElements = this.getNumberOfValidElements();
        var score = (numberOfValidElements / this.numberOfElements) * 100;
        var scoreBottom = Math.floor(score);

        this.updateOnPage(scoreBottom);
    }

    getNumberOfValidElements() {
        var validElements = 0;

        if (this.pagesContainer.homeAddress)
            validElements += this.pagesContainer.homeAddress.numberOfElements.valid;
        if (this.pagesContainer.phoneNumbers)
            validElements += this.pagesContainer.phoneNumbers.numberOfElements.valid;
        if (this.pagesContainer.email)
            validElements += this.pagesContainer.email.numberOfElements.valid;
        if (this.pagesContainer.emergencyContact)
            validElements += this.pagesContainer.emergencyContact.numberOfElements.valid;
        if (this.pagesContainer.raceEthnicity)
            validElements += this.pagesContainer.raceEthnicity.numberOfElements.valid;
        if (this.pagesContainer.gender)
            validElements += this.pagesContainer.gender.numberOfElements.valid;
        if (this.pagesContainer.heightWeight)
            validElements += this.pagesContainer.heightWeight.numberOfElements.valid;
        if (this.pagesContainer.pharmacy)
            validElements += this.pagesContainer.pharmacy.numberOfElements.valid;
        if (this.pagesContainer.questionnaire)
            validElements += this.pagesContainer.questionnaire.numberOfElements.valid;
        if (this.pagesContainer.currentInfo)
            validElements += this.pagesContainer.currentInfo.numberOfElements.valid;
        if (this.pagesContainer.allergies)
            validElements += this.pagesContainer.allergies.numberOfElements.valid;
        if (this.pagesContainer.medicalCondition)
            validElements += this.pagesContainer.medicalCondition.numberOfElements.valid;

        return validElements;
    }

    // update score results on page
    updateOnPage(score) {
        this.percentage.textContent = score + this.completeText;
        this.level.style.width = score + '%';
    }
}