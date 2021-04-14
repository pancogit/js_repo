// page validation utilities


export class PageValidation {

    constructor() {
        this.borderErrorClass = 'home__error-border';
        this.textErrorClass = 'home__error-text';
        this.choiceActiveClass = 'choice__answer--active';
        this.numbersActiveClass = 'numbers__box--active';
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
        this.validateNumber(inputElement, 5);
    }

    // validate number with given number of digits
    // if minimum number of digits is given, then it's used, otherwise it's not used
    validateNumber(inputElement, numberOfDigits, minimumNumberOfDigits) {
        var text = inputElement.input.value;

        var regularExpression = minimumNumberOfDigits ?
            `^\\d{${minimumNumberOfDigits},${numberOfDigits}}$` : `^\\d{${numberOfDigits}}$`;

        // use template strings to pass variable to regular expression constructor
        // backslash must be escaped \\d for regular expression contructor to get \d
        var numberOfDigitsRegExp = new RegExp(regularExpression);

        var phoneNumberCorrect = text.match(numberOfDigitsRegExp);

        this.addOrRemoveInputErrors(inputElement, phoneNumberCorrect);
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
        this.validateNumber(inputElement, 10);
    }

    // if email is confirmed, then look for original email address
    validateEmail(inputElement, confirmEmail = false, originalEmail = 0) {
        var text = inputElement.input.value;

        // email address can have whitespaces before and after address, and consists
        // of standard email notation
        var email = /^\s*\w+(\.\w+)*@\w+\.([a-z]){2,4}\s*$/;

        var validEmail = text.match(email);
        var isValid = validEmail ? true : false;

        // compare with original email if it's confirmed
        if (confirmEmail) isValid &= text === originalEmail.input.value;

        this.addOrRemoveInputErrors(inputElement, isValid);
    }

    validateList(inputElement) {
        var listSelected = inputElement.input.value !== inputElement.defaultMessage;

        this.addOrRemoveInputErrors(inputElement, listSelected);
    }

    validateChoice(inputElement, activeClass) {
        var isValid = false;

        // if active class is given use them, otherwise use active class for choice
        var elementActiveClass = activeClass ? activeClass : this.choiceActiveClass;

        // if any choice is active, then choice is valid
        for (let i = 0; i < inputElement.choices.length; i++)
            if (inputElement.choices[i].classList.contains(elementActiveClass))
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
        var otherCheckboxTextarea = otherCheckboxIsChecked ?
            otherCheckbox.parentElement.nextElementSibling.firstElementChild : 0;

        // if Other checkbox is checked, then if Other textarea is empty,
        // checkboxes are still not valid
        if (otherCheckboxIsChecked) isValid = this.validateTextarea(otherCheckboxTextarea, false);

        this.addOrRemoveTextErrors(inputElement, isValid);
    }

    // textarea must not be empty or filled with just spaces
    validateTextarea(textarea, isTextareaObject = true) {
        var justSpacesPattern = /^\s*$/g;
        var textareaWithSpaces;
        var isValid;

        textareaWithSpaces = isTextareaObject ? 
            textarea.input.value.match(justSpacesPattern) : textarea.value.match(justSpacesPattern);

        // also add or remove error class for textarea
        if (textareaWithSpaces) {
            if (isTextareaObject) {
                textarea.input.classList.add(this.borderErrorClass);
                textarea.question.classList.add(this.textErrorClass);
            }
            else textarea.classList.add(this.borderErrorClass);

            isValid = false;
        }
        else {
            if (isTextareaObject) {
                textarea.input.classList.remove(this.borderErrorClass);
                textarea.question.classList.remove(this.textErrorClass);
            }
            else textarea.classList.remove(this.borderErrorClass);

            isValid = true;
        }

        // update valid flag for textarea object
        if (isTextareaObject) textarea.isValid = isValid;

        return isValid;
    }

    validateHeight(inputElement) {
        var heightFeet = inputElement.feet.object.number.value;
        var heightInches = inputElement.inches.object.number.value;

        // it's valid only if it's not zero in total 
        var isValid = heightFeet || heightInches;

        this.addOrRemoveTextErrors(inputElement, isValid);
    }

    validateWeight(inputElement) {
        var weight = inputElement.pounds.object.number.value;
        var isValid = weight ? true : false;

        this.addOrRemoveTextErrors(inputElement, isValid);
    }

    // RX number is 6 digits long
    validateRXNumber(inputElement) {
        this.validateNumber(inputElement, 6);
    }

    // phamarcy strength / quantity numbers are maximum 4 digits long
    validatePharmacyQuantityNumber(inputElement) {
        this.validateNumber(inputElement, 4, 1);
    }

    // for numbers use choices validation with given class
    validateNumbers(inputElement) {
        this.validateChoice(inputElement, this.numbersActiveClass);
    }
}