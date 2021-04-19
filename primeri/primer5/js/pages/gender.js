// gender page


import { Page } from './page.js';

export class Gender extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        let checkboxWrapper = questions[0].nextElementSibling;

        this.gender = {
            question: questions[0],
            input: checkboxWrapper,
            checkboxes: checkboxWrapper.querySelectorAll('.checkbox__input'),
            isValid: false
        }

        this.numberOfElements.all = 1;
    }

    initPage() {
        super.initPage();

        this.initCheckbox(this.gender);
        this.removeErrorsFromPage();
    }

    removeErrorsFromPage() {
        super.removeErrorsFromPage();

        this.gender.question.classList.remove(this.textErrorClass);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateCheckboxes(this.gender);

        this.isPageValid(this.gender.isValid);
        this.updatePageIcon();
    }

    // update form data for form submission
    updateFormData() {
        super.updateFormData();

        var genderString = this.getTextFromSelectedCheckboxes(this.gender);

        this.formData.set('gender identity', genderString);
    }
}