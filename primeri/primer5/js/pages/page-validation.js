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
        var maximumCharactersReached = text.length > 40;
        var isValid;

        // if input is filled with spaces or it's empty or if maximum number of
        // characters are reached, return false, otherwise return true
        if (inputWithSpaces || maximumCharactersReached) isValid = false;
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

        if (anyButtonChecked)
            inputElement.question.classList.remove(this.textErrorClass);
        else
            inputElement.question.classList.add(this.textErrorClass);

        // update valid flag
        inputElement.isValid = anyButtonChecked;
    }

    // validate phone numbers as 10 digits long
    validatePhoneNumber(inputElement) {
        var text = inputElement.input.value;
        var tenDigits = /^\d{10}$/;
        var phoneNumberCorrect = text.match(tenDigits);

        this.addOrRemoveInputErrors(inputElement, phoneNumberCorrect);
    }
}