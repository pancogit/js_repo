// medical condition page


import { Page } from './page.js';

export class MedicalCondition extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        let checkboxWrapper = questions[0].nextElementSibling;

        this.conditions = {
            question: questions[0],
            input: checkboxWrapper,
            checkboxes: checkboxWrapper.querySelectorAll('.checkbox__input'),
            isValid: false
        }

        let choiceBox = questions[1].nextElementSibling;

        this.glasses = {
            question: questions[1],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        choiceBox = questions[2].nextElementSibling;

        this.care = {
            question: questions[2],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        this.numberOfElements.all = 3;
    }

    initPage() {
        super.initPage();

        this.initCheckbox(this.conditions);
        this.initChoice(this.glasses);
        this.initChoice(this.care);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateCheckboxes(this.conditions);
        this.pageValidation.validateChoice(this.glasses);
        this.pageValidation.validateChoice(this.care);
        
        this.isPageValid(this.conditions.isValid, 
                         this.glasses.isValid, 
                         this.care.isValid);

        this.updatePageIcon();
    }
}