// current info page


import { Page } from './page.js';

export class CurrentInfo extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        let checkboxWrapper = questions[0].nextElementSibling;

        this.concerns = {
            question: questions[0],
            input: checkboxWrapper,
            checkboxes: checkboxWrapper.querySelectorAll('.checkbox__input'),
            isValid: false
        }

        let choiceBox = questions[1].nextElementSibling;

        this.whitened = {
            question: questions[1],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        choiceBox = questions[2].nextElementSibling;

        this.orthodontic = {
            question: questions[2],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        choiceBox = questions[3].nextElementSibling;

        this.gumTissue = {
            question: questions[3],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        this.numberOfElements.all = 4;
    }

    initPage() {
        super.initPage();

        this.initCheckbox(this.concerns);
        this.initChoice(this.whitened);
        this.initChoice(this.orthodontic);
        this.initChoice(this.gumTissue);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateCheckboxes(this.concerns);
        this.pageValidation.validateChoice(this.whitened);
        this.pageValidation.validateChoice(this.orthodontic);
        this.pageValidation.validateChoice(this.gumTissue);

        this.isPageValid(this.concerns.isValid, 
                         this.whitened.isValid, 
                         this.orthodontic.isValid, 
                         this.gumTissue.isValid);
                         
        this.updatePageIcon();
    }
}