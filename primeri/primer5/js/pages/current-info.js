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

        this.removeErrorsFromPage();
    }

    removeErrorsFromPage() {
        super.removeErrorsFromPage();

        this.concerns.question.classList.remove(this.textErrorClass);
        this.whitened.question.classList.remove(this.textErrorClass);
        this.orthodontic.question.classList.remove(this.textErrorClass);
        this.gumTissue.question.classList.remove(this.textErrorClass);
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

    // update form data for form submission
    updateFormData() {
        super.updateFormData();

        var smileConcerns = this.getTextFromSelectedCheckboxes(this.concerns);
        var whitenedTeeth = this.getActiveText(this.whitened, this.choiceActiveClass);
        var orthodonticTreatment = this.getActiveText(this.orthodontic, this.choiceActiveClass);
        var gumTissueTreatment = this.getActiveText(this.gumTissue, this.choiceActiveClass);

        this.formData.set('current info smile concerns', smileConcerns);
        this.formData.set('current info whitened teeth', whitenedTeeth);
        this.formData.set('current info orthodontic treatment', orthodonticTreatment);
        this.formData.set('current info gum tissue treatment', gumTissueTreatment);
    }
}