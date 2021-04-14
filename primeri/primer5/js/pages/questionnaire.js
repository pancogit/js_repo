// questionnaire page


import { Page } from './page.js';

export class Questionnaire extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        this.lastExam = {
            question: questions[0],
            input: questions[0].nextElementSibling,
            isValid: false
        }

        let choiceBox = questions[1].nextElementSibling;

        this.pain = {
            question: questions[1],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        let list = questions[2].nextElementSibling;

        this.howLong = {
            question: questions[2],
            input: list,
            defaultMessage: list.firstElementChild.value,
            isValid: false
        }

        list = questions[3].nextElementSibling;

        this.brush = {
            question: questions[3],
            input: list,
            defaultMessage: list.firstElementChild.value,
            isValid: false
        }

        list = questions[4].nextElementSibling;

        this.floss = {
            question: questions[4],
            input: list,
            defaultMessage: list.firstElementChild.value,
            isValid: false
        }

        choiceBox = questions[5].nextElementSibling;

        this.smile = {
            question: questions[5],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.numbers__box'),
            isValid: false
        }

        choiceBox = questions[6].nextElementSibling;

        this.whiter = {
            question: questions[6],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        choiceBox = questions[7].nextElementSibling;

        this.like = {
            question: questions[7],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        this.numberOfElements.all = 8;
    }

    initPage() {
        super.initPage();

        this.lastExam.input.value = '';

        this.initChoice(this.pain);
        this.initList(this.howLong);
        this.initList(this.brush);
        this.initList(this.floss);
        this.initNumbers(this.smile);
        this.initChoice(this.whiter);
        this.initChoice(this.like);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateInput(this.lastExam);
        this.pageValidation.validateChoice(this.pain);
        this.pageValidation.validateList(this.howLong);
        this.pageValidation.validateList(this.brush);
        this.pageValidation.validateList(this.floss);
        this.pageValidation.validateNumbers(this.smile);
        this.pageValidation.validateChoice(this.whiter);
        this.pageValidation.validateChoice(this.like);

        this.isPageValid(this.lastExam.isValid,
                         this.pain.isValid,
                         this.howLong.isValid,
                         this.brush.isValid,
                         this.floss.isValid,
                         this.smile.isValid,
                         this.whiter.isValid,
                         this.like.isValid);

        this.updatePageIcon();
    }
}