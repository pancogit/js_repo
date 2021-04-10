// page validation utilities


export class PageValidation {

    constructor() {
        this.borderErrorClass = 'home__error-border';
        this.textErrorClass = 'home__error-text';
    }

    // validation of simple text input
    validateInput(inputElement) {
        var text = inputElement.input.value;
        var spaces = /^\s*$/;
        var inputWithSpaces = text.match(spaces);
        var isValid;

        // if input is filled with spaces return false, otherwise return true
        if (inputWithSpaces) isValid = false;
        else isValid = true;

        this.addOrRemoveInputErrors(inputElement, isValid);
    }

    // add or remove input errors from page if validation failed or not
    addOrRemoveInputErrors(inputElement, isValid) {
        if (isValid) {
            inputElement.input.classList.remove(this.borderErrorClass);
            inputElement.question.classList.remove(this.textErrorClass);
        }
        else {
            inputElement.input.classList.add(this.borderErrorClass);
            inputElement.question.classList.add(this.textErrorClass);
        }

        // update valid flag
        inputElement.isValid = isValid;
    }

    // zip code must be 5 digits
    validateZipCode(inputElement) {
        var text = inputElement.input.value;
        var fiveDigits = /^\d{5}$/;
        var maximumFiveDigits = text.match(fiveDigits);

        this.addOrRemoveInputErrors(inputElement, maximumFiveDigits);
    }

    validateRadioButtons(inputElement, ...radioButtons) {
        var anyButtonChecked = false;

        for (let i = 0; i < radioButtons.length; i++)
            if (radioButtons[i].checked) {
                anyButtonChecked = true;
                break;
            }

        this.addOrRemoveTextErrors(inputElement, anyButtonChecked);
    }

    // just add or remove errors to the heading text
    addOrRemoveTextErrors(inputElement, isValid) {
        if (isValid)
            inputElement.question.classList.remove(this.textErrorClass);
        else
            inputElement.question.classList.add(this.textErrorClass);

        // update valid flag
        inputElement.isValid = isValid;
    }

    // validate phone numbers as 10 digits long
    validatePhoneNumber(inputElement) {
        var text = inputElement.input.value;
        var tenDigits = /^\d{10}$/;
        var phoneNumberCorrect = text.match(tenDigits);

        this.addOrRemoveInputErrors(inputElement, phoneNumberCorrect);
    }

    validateEmail(inputElement) {
        var text = inputElement.input.value;

        // email address can have whitespaces before and after address, and consists
        // of standard email notation
        var email = /^\s*\w+(\.\w+)*@\w+\.([a-z]){2,4}\s*$/;

        var validEmail = text.match(email);

        this.addOrRemoveInputErrors(inputElement, validEmail);
    }

    validateList(inputElement) {
        var listSelected = inputElement.input.value !== inputElement.defaultMessage;

        this.addOrRemoveInputErrors(inputElement, listSelected);
    }

    validateChoice(inputElement) {
        var isValid = false;

        // if any choice is active, then choice is valid
        for (let i = 0; i < inputElement.choices.length; i++)
            if (inputElement.choices[i].classList.contains('choice__answer--active'))
                isValid = true;
        
        this.addOrRemoveTextErrors(inputElement, isValid);
    }

    validateCheckboxes(inputElement) {
        var isValid = false;
        var otherCheckbox;

        // if just one checkbox is checked, then checkboxes are valid
        for (let i = 0; i < inputElement.checkboxes.length; i++) {
            let label = inputElement.checkboxes[i].nextElementSibling;

            if (label.textContent === 'Other') otherCheckbox = inputElement.checkboxes[i];
            if (inputElement.checkboxes[i].checked) isValid = true;
        }

        var otherCheckboxIsChecked = otherCheckbox ? otherCheckbox.checked : false;

        // if Other checkbox is checked, then if Other textarea is empty,
        // checkboxes are still not valid
        if (otherCheckboxIsChecked) isValid = this.validateOtherCheckbox(otherCheckbox);

        this.addOrRemoveTextErrors(inputElement, isValid);
    }

    // textarea must not be empty or filled with just spaces
    validateOtherCheckbox(otherCheckbox) {
        var textarea = otherCheckbox.parentElement.nextElementSibling.firstElementChild;
        var justSpacesPattern = /^\s*$/g;
        var textareaWithSpaces = textarea.value.match(justSpacesPattern);

        // also add or remove error class for textarea
        if (textareaWithSpaces) {
            textarea.classList.add(this.borderErrorClass);
            return false;
        }
        else {
            textarea.classList.remove(this.borderErrorClass);
            return true;
        }
    }
}