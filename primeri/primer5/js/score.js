// score


export class Score {

    constructor(pages) {
        this.score = document.querySelector('.score');
        this.percentage = this.score.querySelector('.score__percentage');
        this.level = this.score.querySelector('.score__level');
        this.pagesContainer = pages;
        this.numberOfElements = 61;
        this.completeText = '% Complete';
        this.currentScore = 0;
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

        var homeAddressValidElements        = this.elementsExists(this.pagesContainer.homeAddress);
        var phoneNumbersValidElements       = this.elementsExists(this.pagesContainer.phoneNumbers);
        var emailValidElements              = this.elementsExists(this.pagesContainer.email);
        var emergencyContactValidElements   = this.elementsExists(this.pagesContainer.emergencyContact);
        var raceEthnicityValidElements      = this.elementsExists(this.pagesContainer.raceEthnicity);
        var genderValidElements             = this.elementsExists(this.pagesContainer.gender);
        var heightWeightValidElements       = this.elementsExists(this.pagesContainer.heightWeight);
        var pharmacyValidElements           = this.elementsExists(this.pagesContainer.pharmacy);
        var questionnaireValidElements      = this.elementsExists(this.pagesContainer.questionnaire);
        var currentInfoValidElements        = this.elementsExists(this.pagesContainer.currentInfo);
        var allergiesValidElements          = this.elementsExists(this.pagesContainer.allergies);
        var medicalConditionValidElements   = this.elementsExists(this.pagesContainer.medicalCondition);

        if (homeAddressValidElements)       validElements += homeAddressValidElements;
        if (phoneNumbersValidElements)      validElements += phoneNumbersValidElements;
        if (emailValidElements)             validElements += emailValidElements;
        if (emergencyContactValidElements)  validElements += emergencyContactValidElements;
        if (raceEthnicityValidElements)     validElements += raceEthnicityValidElements;
        if (genderValidElements)            validElements += genderValidElements;
        if (heightWeightValidElements)      validElements += heightWeightValidElements;
        if (pharmacyValidElements)          validElements += pharmacyValidElements;
        if (questionnaireValidElements)     validElements += questionnaireValidElements;
        if (currentInfoValidElements)       validElements += currentInfoValidElements;
        if (allergiesValidElements)         validElements += allergiesValidElements;
        if (medicalConditionValidElements)  validElements += medicalConditionValidElements;

        return validElements;
    }

    // get number of valid elements if they exists
    elementsExists(element) {
        return element ? (element.numberOfElements ? element.numberOfElements.valid : 0) : 0;
    }

    // update score results on page
    updateOnPage(score) {
        this.percentage.textContent = score + this.completeText;
        this.level.style.width = score + '%';

        // save score results
        this.currentScore = score;
    }
}