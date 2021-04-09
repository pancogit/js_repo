// phone numbers page


import { Page } from './page.js';

export class PhoneNumbers extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        this.homeForm = this.page.firstElementChild;

        this.questionClass = 'home__question';
        this.phoneClass = 'home__phone';
        let questions = this.page.querySelectorAll('.' + this.questionClass);

        this.homePhone = {
            question: questions[0],
            input: questions[0].nextElementSibling,
            isValid: false
        }

        this.workPhone = {
            question: questions[1],
            input: questions[1].nextElementSibling,
            isValid: false
        }

        let selectList = questions[2].nextElementSibling;

        this.mobilePhones = {
            question: questions[2],
            input: selectList,
            homeRow: questions[2].parentElement.parentElement,
            defaultMessage: selectList.firstElementChild.value,
            isValid: false,

            // mobile phones are dynamically created when list is changed
            numberOfPhonesOnPage: 0,
            phones: []
        }

        this.removeStaticMobilePhones(questions);
    }

    // remove static mobile phones list 
    removeStaticMobilePhones(questions) {
        for (let i = 3; i < questions.length; i++) {
            let homeRow = questions[i].parentElement.parentElement;

            this.homeForm.removeChild(homeRow);
        }
    }

    initPage() {
        super.initPage();

        this.homePhone.input.value = '';
        this.workPhone.input.value = '';

        // init list to default question name and add event listener to the list
        this.initList();
    }

    initList() {
        var list = this.mobilePhones.input;
        var listIsSelected = list.value !== this.mobilePhones.defaultMessage;
        
        // remove list and create new
        if (listIsSelected) {
            let homeColumn = list.parentElement;
            let newList = this.copyListHTML(list);

            homeColumn.removeChild(list);
            homeColumn.appendChild(newList);

            this.mobilePhones.input = newList;
        }

        // add event listener to the list
        this.mobilePhones.input.addEventListener('change', this.listIsChanged.bind(this));
    }

    // create new mobile phone numbers or delete some when list is changed
    listIsChanged(event) {
        var numberOfMobilePhones = parseInt(event.target.selectedOptions[0].textContent);

        this.getNumberOfPhonesOnPage();

        var phonesDifference = numberOfMobilePhones - this.mobilePhones.numberOfPhonesOnPage;
        var addNewPhones = phonesDifference > 0;
        var removePhones = phonesDifference < 0;

        // add new phones or remove existing
        if (addNewPhones) 
            this.addMobilePhonesOnPage(phonesDifference);
        else if (removePhones) 
            this.removeMobilePhonesFromPage(phonesDifference);
    }

    getNumberOfPhonesOnPage() {
        var mobilePhone = this.mobilePhones.homeRow.nextElementSibling;

        this.mobilePhones.numberOfPhonesOnPage = 0;

        // search for mobile phones on page
        while(mobilePhone) {
            this.mobilePhones.numberOfPhonesOnPage++;
            mobilePhone = mobilePhone.nextElementSibling;
        }
    }

    // create mobile phone HTML including row wrapper element
    createMobilePhoneHTML(phoneIndex) {
        var row = document.createElement('div');
        var col = document.createElement('div');
        var question = document.createElement('div');
        var phone = document.createElement('input');

        row.classList.add('home__row');
        col.classList.add('home__col-1');
        question.classList.add(this.questionClass);
        question.textContent = 'Mobile Phone ' + phoneIndex;  // add index of phone
        phone.classList.add('home__phone');
        phone.type = 'number';

        row.append(col);
        col.append(question);
        col.append(phone);

        return row;
    }

    addMobilePhonesOnPage(difference) {
        for (let i = 0; i < difference; i++) {
            let mobilePhone = 
                this.createMobilePhoneHTML(this.mobilePhones.numberOfPhonesOnPage + 1);

            this.mobilePhones.phones.push(mobilePhone);
            this.homeForm.appendChild(mobilePhone);
            this.mobilePhones.numberOfPhonesOnPage++;
        }
    }

    removeMobilePhonesFromPage(difference) {
        var numberOfPhonesToRemove= -difference;

        // remove last mobile phones one by one
        for (let i = 0; i < numberOfPhonesToRemove; i++) {
            let mobilePhone = this.mobilePhones.phones.pop();

            this.homeForm.removeChild(mobilePhone);
            this.mobilePhones.numberOfPhonesOnPage--;
        }
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validatePhoneNumber(this.homePhone);
        this.pageValidation.validatePhoneNumber(this.workPhone);
        this.validateMobilePhones();

        this.isPageValid();
        this.updatePageIcon();
        this.updateNumberOfValidElements();
    }

    // if mobile phones are not valid, then list is also not valid
    validateMobilePhones() {
        var phonesValid = true;
        
        // there are no mobile phones on the page
        if (!this.mobilePhones.phones.length) phonesValid = false;

        // if all phones on the page are valid, then list is valid
        else phonesValid = this.phonesAreValid();

        // validate phone numbers list
        this.pageValidation.addOrRemoveInputErrors(this.mobilePhones, phonesValid);
    }

    phonesAreValid() {
        var phonesValid = true;

        for (let i = 0; i < this.mobilePhones.phones.length; i++) {
            let inputElement = this.mobilePhones.phones[i].querySelector('.' + this.phoneClass);
            let questionElement = this.mobilePhones.phones[i].querySelector('.' + this.questionClass);

            this.pageValidation.validatePhoneNumber({
                input: inputElement,
                question: questionElement
            });

            // after phone validation, detect if any phone is not valid
            if (inputElement.classList.contains(this.borderErrorClass)) phonesValid = false;
        }

        return phonesValid;
    }

    // update valid flag for whole page
    isPageValid() {
        super.isPageValid();

        this.pageValid =
            this.homePhone.isValid &&
            this.workPhone.isValid &&
            this.mobilePhones.isValid;
    }

    updateNumberOfValidElements() {
        super.updateNumberOfValidElements();

        this.numberOfElements.valid = 0;

        if (this.homePhone.isValid) this.numberOfElements.valid++;
        if (this.workPhone.isValid) this.numberOfElements.valid++;
        if (this.mobilePhones.isValid) this.numberOfElements.valid++;
    }
}