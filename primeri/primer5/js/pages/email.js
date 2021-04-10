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
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateEmail(this.email);
        this.pageValidation.validateEmail(this.emailConfirm);
        this.pageValidation.validateEmail(this.emailAlternate);

        this.isPageValid(this.email.isValid,
                         this.emailConfirm.isValid,
                         this.emailAlternate.isValid);

        this.updatePageIcon();
    }
}