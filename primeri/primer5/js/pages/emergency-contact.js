// emergency contact page


import { Page } from './page.js';

export class EmergencyContact extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        this.primaryName = {
            question: questions[0],
            input: questions[0].nextElementSibling,
            isValid: false
        }

        let primaryList = questions[1].nextElementSibling;

        this.primaryNameRelation = {
            question: questions[1],
            input: primaryList,
            defaultMessage: primaryList.firstElementChild.value,
            isValid: false
        }

        this.secondaryName = {
            question: questions[2],
            input: questions[2].nextElementSibling,
            isValid: false
        }

        let secondaryList = questions[3].nextElementSibling;

        this.secondaryNameRelation = {
            question: questions[3],
            input: secondaryList,
            defaultMessage: secondaryList.firstElementChild.value,
            isValid: false
        }

        this.hospital = {
            question: questions[4],
            input: questions[4].nextElementSibling,
            isValid: false
        }

        this.doctor = {
            question: questions[5],
            input: questions[5].nextElementSibling,
            isValid: false
        }

        this.doctorPhone = {
            question: questions[6],
            input: questions[6].nextElementSibling,
            isValid: false
        }

        this.dentist = {
            question: questions[7],
            input: questions[7].nextElementSibling,
            isValid: false
        }

        this.dentistPhone = {
            question: questions[8],
            input: questions[8].nextElementSibling,
            isValid: false
        }

        this.company = {
            question: questions[9],
            input: questions[9].nextElementSibling,
            isValid: false
        }

        this.policy = {
            question: questions[10],
            input: questions[10].nextElementSibling,
            isValid: false
        }

        this.numberOfElements.all = 11;
    }

    initPage() {
        super.initPage();

        this.primaryName.input.value = '';
        this.secondaryName.input.value = '';
        this.hospital.input.value = '';
        this.doctor.input.value = '';
        this.doctorPhone.input.value = '';
        this.dentist.input.value = '';
        this.dentistPhone.input.value = '';
        this.company.input.value = '';
        this.policy.input.value = '';

        this.initList(this.primaryNameRelation);
        this.initList(this.secondaryNameRelation);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateInput(this.primaryName);
        this.pageValidation.validateList(this.primaryNameRelation);
        this.pageValidation.validateInput(this.secondaryName);
        this.pageValidation.validateList(this.secondaryNameRelation);
        this.pageValidation.validateInput(this.hospital);
        this.pageValidation.validateInput(this.doctor);
        this.pageValidation.validatePhoneNumber(this.doctorPhone);
        this.pageValidation.validateInput(this.dentist);
        this.pageValidation.validatePhoneNumber(this.dentistPhone);
        this.pageValidation.validateInput(this.company);
        this.pageValidation.validateInput(this.policy);

        this.isPageValid(this.primaryName.isValid,
                         this.primaryNameRelation.isValid,
                         this.secondaryName.isValid,
                         this.secondaryNameRelation.isValid,
                         this.hospital.isValid,
                         this.doctor.isValid,
                         this.doctorPhone.isValid,
                         this.dentist.isValid,
                         this.dentistPhone.isValid,
                         this.company.isValid,
                         this.policy.isValid);

        this.updatePageIcon();
    }
}