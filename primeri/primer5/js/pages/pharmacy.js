// pharmacy page


import { Page } from './page.js';

export class Pharmacy extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        this.date = {
            question: questions[0],
            input: questions[0].nextElementSibling,
            isValid: false
        }

        this.prescriptionNumber = {
            question: questions[1],
            input: questions[1].nextElementSibling,
            isValid: false
        }

        this.type = {
            question: questions[2],
            new: this.page.querySelector('#type-new-id'),
            refill: this.page.querySelector('#type-refill-id'),
            isValid: false
        }

        let choiceBox = questions[3].nextElementSibling;

        this.scanned = {
            question: questions[3],
            input: choiceBox,
            choices: choiceBox.querySelectorAll('.choice__answer'),
            isValid: false
        }

        this.drug = {
            question: questions[4],
            input: questions[4].nextElementSibling,
            isValid: false
        }

        this.strength = {
            question: questions[5],
            input: questions[5].nextElementSibling.firstElementChild,
            isValid: false
        }

        this.directions = {
            question: questions[6],
            input: questions[6].nextElementSibling,
            isValid: false
        }

        this.quantityPrescribed = {
            question: questions[7],
            input: questions[7].nextElementSibling.firstElementChild,
            isValid: false
        }

        this.quantityIngested = {
            question: questions[8],
            input: questions[8].nextElementSibling.firstElementChild,
            isValid: false
        }

        this.quantityDispensed = {
            question: questions[9],
            input: questions[9].nextElementSibling.firstElementChild,
            isValid: false
        }

        this.quantityReturned = {
            question: questions[10],
            input: questions[10].nextElementSibling.firstElementChild,
            isValid: false
        }

        this.pharmacistName = {
            question: questions[11],
            input: questions[11].nextElementSibling,
            isValid: false
        }

        this.pharmacistLicense = {
            question: questions[12],
            input: questions[12].nextElementSibling,
            isValid: false
        }

        this.numberOfElements.all = 13;
    }

    initPage() {
        super.initPage();

        this.date.input.value = '';
        this.prescriptionNumber.input.value = '';
        this.type.new.checked = false;
        this.type.refill.checked = false;
        this.drug.input.value = '';
        this.strength.input.value = '';
        this.directions.input.value = '';
        this.quantityPrescribed.input.value = '';
        this.quantityIngested.input.value = '';
        this.quantityDispensed.input.value = '';
        this.quantityReturned.input.value = '';
        this.pharmacistName.input.value = '';
        this.pharmacistLicense.input.value = '';

        this.initChoice(this.scanned);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateInput(this.date);
        this.pageValidation.validateRXNumber(this.prescriptionNumber);
        this.pageValidation.validateRadioButtons(this.type, this.type.new, this.type.refill);
        this.pageValidation.validateChoice(this.scanned);
        this.pageValidation.validateInput(this.drug);
        this.pageValidation.validatePharmacyQuantityNumber(this.strength);
        this.pageValidation.validateTextarea(this.directions);
        this.pageValidation.validatePharmacyQuantityNumber(this.quantityPrescribed);
        this.pageValidation.validatePharmacyQuantityNumber(this.quantityIngested);
        this.pageValidation.validatePharmacyQuantityNumber(this.quantityDispensed);
        this.pageValidation.validatePharmacyQuantityNumber(this.quantityReturned);
        this.pageValidation.validateInput(this.pharmacistName);
        this.pageValidation.validateInput(this.pharmacistLicense);

        this.isPageValid(this.date.isValid, 
                         this.prescriptionNumber.isValid, 
                         this.type.isValid, 
                         this.scanned.isValid,
                         this.drug.isValid,
                         this.strength.isValid,
                         this.directions.isValid,
                         this.quantityPrescribed.isValid,
                         this.quantityIngested.isValid,
                         this.quantityDispensed.isValid,
                         this.quantityReturned.isValid,
                         this.pharmacistName.isValid,
                         this.pharmacistLicense.isValid);
                         
        this.updatePageIcon();
    }
}