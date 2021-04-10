// race ethnicity page


import { Page } from './page.js';

export class RaceEthnicity extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        let choiceBox = questions[0].nextElementSibling;

        this.race = {
            question: questions[0],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        let checkboxWrapper = questions[1].nextElementSibling;

        this.ethnicity = {
            question: questions[1],
            input: checkboxWrapper,
            checkboxes: checkboxWrapper.querySelectorAll('.checkbox__input'),
            isValid: false
        }

        this.numberOfElements.all = 2;
    }

    initPage() {
        super.initPage();

        this.initChoice(this.race);
        this.initCheckbox(this.ethnicity);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateChoice(this.race);
        this.pageValidation.validateCheckboxes(this.ethnicity);

        this.isPageValid(this.race.isValid, this.ethnicity.isValid);
        this.updatePageIcon();
    }
}