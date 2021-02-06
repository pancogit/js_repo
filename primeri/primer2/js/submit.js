// submit


class Submit {

    constructor() {
        this.email = document.getElementsByClassName('submit__email').item(0);
        this.emailSubmit = this.email.nextElementSibling;
        this.emailForm = this.email.form;
        this.zip = document.getElementsByClassName('submit__zip').item(0);
        this.zipSubmit = this.zip.nextElementSibling;
        this.zipForm = this.zip.form;
        this.inputErrorClass = 'submit__input--error';
        this.errorMessageClass = 'submit__error';
    }

    // add event listeners to forms when submitted
    addEventListeners() {

        // don't use HTML5 validation for email and number input because of manual javascript validation
        this.emailForm.noValidate = true;
        this.zipForm.noValidate = true;

        // forward this pointer to handler functions
        this.emailForm.addEventListener('submit', this.checkEmail.bind(this));
        this.zipForm.addEventListener('submit', this.checkZip.bind(this));
    }

    // check email
    checkEmail(e) {
        var emailText = this.email.value;

        // regular expression pattern
        var emailPattern = /^\s*\w+(\.\w+)*@\w+\.\w{2,4}\s*$/;

        // add error message
        if (!emailText.match(emailPattern)) {
            e.preventDefault();

            this.addErrorMessage(this.email, this.emailForm, 'Please enter valid email address!');
        }
        // remove error message
        else this.removeErrorMessage(this.email, this.emailForm);
    }

    // check zip code
    checkZip(e) {
        var zipCode = this.zip.value;
        var zipCodeNumbers = parseInt(zipCode);
        var zipCodeNegative = zipCodeNumbers < 0;
        var fiveDigitsOrLess;

        // count number of digits
        if (zipCodeNegative) fiveDigitsOrLess = false;
        else fiveDigitsOrLess = zipCode.length <= 5 ? true : false;

        // zip code must be maximum five digits long, must be positive and not empty
        // add error message to page
        if (!zipCode || zipCodeNegative || !fiveDigitsOrLess) {
            e.preventDefault();

            this.addErrorMessage(this.zip, this.zipForm, 'Please enter valid ZIP code!');
        }
        // remove error message from page
        else this.removeErrorMessage(this.zip, this.zipForm);
    }

    // add error message to page
    addErrorMessage(input, form, message) {
        if (!input.classList.contains(this.inputErrorClass)) {
            input.classList.add(this.inputErrorClass);

            if (!form.getElementsByClassName(this.errorMessageClass).length) {
                let error = document.createElement('p');

                error.classList.add(this.errorMessageClass);
                error.textContent = message;
                form.append(error);
            }
        }
    }

    // remove error message from page
    removeErrorMessage(input, form) {
        input.classList.remove(this.inputErrorClass);
        form.getElementsByClassName(this.errorMessageClass).item(0).remove();
    }
}


// add event listeners for submit elements
(function submitEvents() {

    var submit = new Submit();
    submit.addEventListeners();

}());