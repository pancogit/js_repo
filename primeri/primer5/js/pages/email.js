// email page


import { Page } from './page.js';

export class Email extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        this.email = {
            question: questions[0],
            input: questions[0].nextElementSibling,
            isValid: false
        }

        this.emailConfirm = {
            question: questions[1],
            input: questions[1].nextElementSibling,
            isValid: false
        }

        this.emailAlternate = {
            question: questions[2],
            input: questions[2].nextElementSibling,
            isValid: false
        }

        this.numberOfElements.all = 3;
    }

    initPage() {
        super.initPage();

        this.email.input.value = '';
        this.emailConfirm.input.value = '';
        this.emailAlternate.input.value = '';

        this.removeErrorsFromPage();
    }

    removeErrorsFromPage() {
        super.removeErrorsFromPage();

        this.email.question.classList.remove(this.textErrorClass);
        this.email.input.classList.remove(this.borderErrorClass);
        this.emailConfirm.question.classList.remove(this.textErrorClass);
        this.emailConfirm.input.classList.remove(this.borderErrorClass);
        this.emailAlternate.question.classList.remove(this.textErrorClass);
        this.emailAlternate.input.classList.remove(this.borderErrorClass);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateEmail(this.email);
        this.pageValidation.validateEmail(this.emailConfirm, true, this.email);
        this.pageValidation.validateEmail(this.emailAlternate);

        this.isPageValid(this.email.isValid,
                         this.emailConfirm.isValid,
                         this.emailAlternate.isValid);

        this.updatePageIcon();
    }

    // update form data for form submission
    updateFormData() {
        super.updateFormData();

        this.formData.set('email primary e-mail', this.email.input.value);
        this.formData.set('email confirm e-mail', this.emailConfirm.input.value);
        this.formData.set('email alternate e-mail', this.emailAlternate.input.value);
    }
}