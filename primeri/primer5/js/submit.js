// submit results


export class Submit {

    constructor(scoreObject, pagesObject, navigationObject) {
        this.score = scoreObject;
        this.pages = pagesObject;
        this.navigation = navigationObject;
        this.homepage = document.querySelector('.page');

        this.text = {
            normal: 'Please submit to continue',
            error: 'Please complete form before continue'
        }

        this.textClass = 'submit__text';
        this.footerClass = 'submit__footer';
        this.footerCenterClass = 'submit__footer--center';
        this.buttonSubmitClass = 'submit__button--submit';
        this.windowClass = 'submit__window';

        let messageHTML = this.createSubmitHTML();

        this.message = {
            wrapper: messageHTML,
            window: messageHTML.querySelector('.' + this.windowClass),
            text: messageHTML.querySelector('.' + this.textClass),
            footer: messageHTML.querySelector('.' + this.footerClass),
            submitButton: messageHTML.querySelector('.' + this.buttonSubmitClass)
        }

        // form data used for form submission with ajax
        this.formDataFromAllPages = new FormData();
    }

    /* 
    <div class="submit">
        <div class="submit__window">
            <h1 class="submit__heading">Submit Message</h1>
            <div class="submit__text">Please submit to continue</div>
            <div class="submit__footer">
                <button class="submit__button submit__button--close">Close</button>
                <button class="submit__button submit__button--submit">Submit</button>
            </div>
        </div>
    </div> 
    */
    createSubmitHTML() {
        var submit = document.createElement('div');
        var window = document.createElement('div');
        var heading = document.createElement('h1');
        var text = document.createElement('div');
        var footer = document.createElement('div');
        var buttonClose = document.createElement('button');
        var buttonSubmit = document.createElement('button');

        submit.classList.add('submit');
        window.classList.add(this.windowClass);
        heading.classList.add('submit__heading');
        heading.textContent = 'Submit Message';
        text.classList.add(this.textClass);
        text.textContent = this.text.normal;
        footer.classList.add(this.footerClass);
        buttonClose.classList.add('submit__button', 'submit__button--close');
        buttonClose.textContent = 'Close';
        buttonSubmit.classList.add('submit__button', this.buttonSubmitClass);
        buttonSubmit.textContent = 'Submit';

        // add event listeners to buttons
        buttonClose.addEventListener('click', this.closeMessage.bind(this));
        buttonSubmit.addEventListener('click', this.submitMessage.bind(this));

        submit.append(window);
        window.append(heading);
        window.append(text);
        window.append(footer);
        footer.append(buttonClose);
        footer.append(buttonSubmit);

        return submit;
    }

    closeMessage(event) {
        document.body.removeChild(this.message.wrapper);
        this.restoreBodyScroll();
    }

    submitMessage(event) {
        this.updateFormDataForAllPages();

        // submit data to example server and when it's submitted, init all pages
        fetch('https://www.example.com', {
            method: 'post',
            body: this.formDataFromAllPages,
            mode: 'no-cors'
        });

        // close window, init pages again and remove form data
        // don't wait for ajax call to finish
        this.closeMessage();
        this.initAllPages();
        this.removeFormData();

        // reset all navigation icons and links and show first page again
        this.navigation.resetIcons();
        this.navigation.showFirstPage();
    }

    updateFormDataForAllPages() {
        this.updateFormDataForPage(this.pages.homeAddress);
        this.updateFormDataForPage(this.pages.phoneNumbers);
        this.updateFormDataForPage(this.pages.email);
        this.updateFormDataForPage(this.pages.emergencyContact);
        this.updateFormDataForPage(this.pages.raceEthnicity);
        this.updateFormDataForPage(this.pages.gender);
        this.updateFormDataForPage(this.pages.heightWeight);
        this.updateFormDataForPage(this.pages.pharmacy);
        this.updateFormDataForPage(this.pages.questionnaire);
        this.updateFormDataForPage(this.pages.currentInfo);
        this.updateFormDataForPage(this.pages.allergies);
        this.updateFormDataForPage(this.pages.medicalCondition);
    }

    updateFormDataForPage(page) {
        if (page) {
            page.updateFormData();
            this.addFormData(page.formData);
        }
    }

    addFormData(formData) {
        var formDataIterator = formData.entries();
        var data, key, value;

        // iterate with iterator and add keys to the form data list
        while(true) {
            data = formDataIterator.next();

            if (data.done) break;
            
            key = data.value[0];
            value = data.value[1];

            // add new form data if it's not there or update if it's there
            this.formDataFromAllPages.set(key, value);
        }
    }

    initAllPages() {
        if (this.pages.homeAddress)      this.pages.homeAddress.initPage();
        if (this.pages.phoneNumbers)     this.pages.phoneNumbers.initPage();
        if (this.pages.email)            this.pages.email.initPage();
        if (this.pages.emergencyContact) this.pages.emergencyContact.initPage();
        if (this.pages.raceEthnicity)    this.pages.raceEthnicity.initPage();
        if (this.pages.gender)           this.pages.gender.initPage();
        if (this.pages.heightWeight)     this.pages.heightWeight.initPage();
        if (this.pages.pharmacy)         this.pages.pharmacy.initPage();
        if (this.pages.questionnaire)    this.pages.questionnaire.initPage();
        if (this.pages.currentInfo)      this.pages.currentInfo.initPage();
        if (this.pages.allergies)        this.pages.allergies.initPage();
        if (this.pages.medicalCondition) this.pages.medicalCondition.initPage();
    }

    removeFormData() {
        var iteratorKeys = this.formDataFromAllPages.keys();
        var key, allKeys = [];

        while (true) {
            key = iteratorKeys.next();

            if (key.done) break;
            else allKeys.push(key.value);
        }

        // remove all keys
        allKeys.forEach(function itearte(value, index, array) {
            this.formDataFromAllPages.delete(value);
        }, this);
    }

    tryToSubmit() {
        let formIsComplete = this.score.currentScore === 100;

        // form is complete
        if (formIsComplete) this.setCompleteMessage();
        else                this.setNotCompleteMessage();

        document.body.append(this.message.wrapper);
        this.removeBodyScroll();
    }

    // set HTML message for complete form
    // return default text and return submit button
    setCompleteMessage() {
        this.message.text.textContent = this.text.normal;
        this.message.footer.classList.remove(this.footerCenterClass);

        // add submit button if it's not there
        if (!this.message.footer.contains(this.message.submitButton))
            this.message.footer.append(this.message.submitButton);
    }

    // set HTML message for not complete form
    // set error text with current score, center close button and remove submit button
    setNotCompleteMessage() {
        this.message.text.textContent = this.text.error + ` (${this.score.currentScore}% / 100%)`;
        this.message.footer.classList.add(this.footerCenterClass);

        // remove submit button if it's there
        if (this.message.footer.contains(this.message.submitButton))
            this.message.footer.removeChild(this.message.submitButton);
    }

    removeBodyScroll() {
        document.body.style.overflow = 'hidden';
        document.body.style.marginRight = '1rem';  // add right margin for scroll bars
        document.body.style.height = '100%';

        this.homepage.style.filter = 'blur(0.7rem)';
    }

    restoreBodyScroll() {
        document.body.style.overflow = '';
        document.body.style.marginRight = '';
        document.body.style.height = '';

        this.homepage.style.filter = '';
    }
}