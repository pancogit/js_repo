// page


import { IconClasses } from '../icon-classes.js';

export class Page {

    constructor(pageObject, linkObject, iconObject) {
        this.page = pageObject;
        this.link = linkObject;
        this.icon = iconObject;
        this.pageValid = false;
        this.numberOfElements = {
            all: 0,    // how many elements are on page
            valid: 0   // how many elements are valid
        }
        this.borderErrorClass = 'home__error-border';
        this.textErrorClass = 'home__error-text';

        // classes for icons
        this.iconClasses = new IconClasses();
    }

    initPage() {
        
    }

    validatePage() {

    }

    isPageValid() {

    }

    updateNumberOfValidElements() {

    }

    validateInput(inputElement) {
        var text = inputElement.value;
        var spaces = /^\s*$/;
        var inputWithSpaces = text.match(spaces);
        var maximumCharactersReached = text.length > 40;

        // if input is filled with spaces or it's empty or if maximum number of
        // characters are reached, return false, otherwise return true
        if (inputWithSpaces || maximumCharactersReached) return false;
        else return true;
    }

    // zip code must be 5 digits
    validateZipCode(inputElement) {
        var text = inputElement.value;
        var fiveDigits = /^\d{5}$/;
        var maximumFiveDigits = text.match(fiveDigits);

        return maximumFiveDigits;
    }

    validateRadioButtons(...radioButtons) {
        var anyButtonChecked = false;

        for (let i = 0; i < radioButtons.length; i++)
            if (radioButtons[i].checked) {
                anyButtonChecked = true;
                break;
            }
        
        return anyButtonChecked;
    }

    // update page icon for page validity
    updatePageIcon() {
        var pageIsAlreadyValid = this.iconContainsClasses(...this.iconClasses.checkCircleClasses);
        var pageIsAlreadyNotValid = this.iconContainsClasses(...this.iconClasses.exclamationClasses);

        // basic circles are not used anymore
        this.icon.classList.remove(...this.iconClasses.circleClasses);

        if (this.pageValid && !pageIsAlreadyValid) {
            // first remove clases before adding new ones
            this.icon.classList.remove(...this.iconClasses.exclamationClasses);
            this.icon.classList.add(...this.iconClasses.checkCircleClasses);
            this.link.classList.remove(this.iconClasses.warningClass);
            this.link.classList.add(this.iconClasses.linkOkClass);
            
        }
        else if (!this.pageValid && !pageIsAlreadyNotValid) {
            this.icon.classList.remove(...this.iconClasses.checkCircleClasses);
            this.icon.classList.add(...this.iconClasses.exclamationClasses);
            this.link.classList.remove(this.iconClasses.linkOkClass);
            this.link.classList.add(this.iconClasses.warningClass);
        }
    }

    iconContainsClasses(...classes) {
        var containsClasses = true;

        for (let i = 0; i < classes.length; i++)
            if (!this.icon.classList.contains(classes[i])) {
                containsClasses = false;
                break;
            }

        return containsClasses;
    }
}