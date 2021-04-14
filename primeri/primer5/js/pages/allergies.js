// allergies page


import { Page } from './page.js';

export class Allergies extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        let choiceBox = questions[0].nextElementSibling;

        this.policy = {
            question: questions[0],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        choiceBox = questions[1].nextElementSibling;

        this.training = {
            question: questions[1],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        let checkboxWrapper = questions[2].nextElementSibling;

        this.food = {
            question: questions[2],
            input: checkboxWrapper,
            checkboxes: checkboxWrapper.querySelectorAll('.checkbox__input'),
            isValid: false
        }

        checkboxWrapper = questions[3].nextElementSibling;

        this.medication = {
            question: questions[3],
            input: checkboxWrapper,
            checkboxes: checkboxWrapper.querySelectorAll('.checkbox__input'),
            isValid: false
        }

        this.numberOfElements.all = 4;
    }

    initPage() {
        super.initPage();

        this.initChoice(this.policy);
        this.initChoice(this.training);
        this.initCheckbox(this.food);
        this.initCheckbox(this.medication);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateChoice(this.policy);
        this.pageValidation.validateChoice(this.training);
        this.pageValidation.validateCheckboxes(this.food);
        this.pageValidation.validateCheckboxes(this.medication);

        this.isPageValid(this.policy.isValid, 
                         this.training.isValid, 
                         this.food.isValid, 
                         this.medication.isValid);

        this.updatePageIcon();
    }
}