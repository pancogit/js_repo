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

        this.removeErrorsFromPage();
    }

    removeErrorsFromPage() {
        super.removeErrorsFromPage();

        this.conditions.question.classList.remove(this.textErrorClass);
        this.glasses.question.classList.remove(this.textErrorClass);
        this.care.question.classList.remove(this.textErrorClass);
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

    // update form data for form submission
    updateFormData() {
        super.updateFormData();

        var health = this.getTextFromSelectedCheckboxes(this.conditions);
        var glasses = this.getActiveText(this.glasses, this.choiceActiveClass);
        var care = this.getActiveText(this.care, this.choiceActiveClass);

        this.formData.set('medical condition health', health);
        this.formData.set('medical condition glasses or contacts', glasses);
        this.formData.set('medical condition under care', care);
    }
}