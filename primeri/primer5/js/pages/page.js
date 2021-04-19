// page


import { IconClasses } from '../icon-classes.js';
import { PageValidation } from './page-validation.js';

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
        this.choiceActiveClass = 'choice__answer--active';
        this.numbersActiveClass = 'numbers__box--active';
        this.checkboxRowOtherClass = 'checkbox__row--other';

        // validation utilities
        this.pageValidation = new PageValidation();

        // form data for form submission
        this.formData = new FormData();

        // bound function used to add / remove the same event listener with the same reference
        this.checkboxOtherIsClickedBound = this.checkboxOtherIsClicked.bind(this);
    }

    initPage() {
        
    }

    removeErrorsFromPage() {
        
    }

    validatePage() {

    }

    // update form data for form submission
    updateFormData() {
        
    }

    isPageValid(...validFlags) {
        this.numberOfElements.valid = 0;
        this.pageValid = true;

        // page is not valid if there are no elements
        if (!validFlags.length) this.pageValid = false;

        // page is valid only if all valid flags are true
        validFlags.forEach(function iterate(value, index, array) {
            this.pageValid &&= value;

            if (value) this.numberOfElements.valid++;
        }, this);
    }

    // update page icon for page validity
    updatePageIcon() {
        var pageIsAlreadyValid = this.iconContainsClasses(...IconClasses.checkCircleClasses);
        var pageIsAlreadyNotValid = this.iconContainsClasses(...IconClasses.exclamationClasses);

        // basic circles are not used anymore
        this.icon.classList.remove(...IconClasses.circleClasses);

        if (this.pageValid && !pageIsAlreadyValid) {
            // first remove clases before adding new ones
            this.icon.classList.remove(...IconClasses.exclamationClasses);
            this.icon.classList.add(...IconClasses.checkCircleClasses);
            this.link.classList.remove(IconClasses.warningClass);
            this.link.classList.add(IconClasses.linkOkClass);
            
        }
        else if (!this.pageValid && !pageIsAlreadyNotValid) {
            this.icon.classList.remove(...IconClasses.checkCircleClasses);
            this.icon.classList.add(...IconClasses.exclamationClasses);
            this.link.classList.remove(IconClasses.linkOkClass);
            this.link.classList.add(IconClasses.warningClass);
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

    // create new list as list from parameter
    copyListHTML(listElement) {
        var list = document.createElement('select');
        var defaultOption = document.createElement('option');
        var listOptionClass = 'list__option';

        list.classList.add('list');
        defaultOption.classList.add(listOptionClass);
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.textContent = listElement[0].value;

        list.append(defaultOption);

        // copy elements from previous list
        for (let i = 1; i < listElement.length; i++) {
            let option = document.createElement('option');

            option.classList.add(listOptionClass);
            option.textContent = listElement[i].textContent;
            list.append(option);
        }

        return list;
    }

    // remove existing list and create new one
    initList(listWrapper) {
        var list = listWrapper.input;
        var listIsSelected = list.value !== listWrapper.defaultMessage;
        
        // remove list and create new
        if (listIsSelected) {
            let homeColumn = list.parentElement;
            let newList = this.copyListHTML(list);

            homeColumn.removeChild(list);
            homeColumn.appendChild(newList);

            listWrapper.input = newList;
        }
    }

    // init choice box and add event listeners for choices
    initChoice(choiceWrapper, activeClass) {
        choiceWrapper.choices.forEach(function iterate(value, index, array) {
            // if active class is given as argument of function, use them
            value.classList.remove(activeClass ? activeClass : this.choiceActiveClass);

            // send this pointer to the event handler via bind
            value.onclick = this.updateChoice.bind(this, choiceWrapper.choices, activeClass);
        }, this);
    }

    updateChoice(choices, activeClass, event) {
        var target = event.target;

        // if active class is given as argument of function, use them
        var elementActiveClass = activeClass ? activeClass : this.choiceActiveClass;

        var targetAlreadyActive = target.classList.contains(elementActiveClass);

        // don't do anything if the same choice is clicked
        if (targetAlreadyActive) return;

        // remove active choice and then update current choice
        choices.forEach(function iterate(value, index, array) {
            value.classList.remove(elementActiveClass);
        }, this);

        target.classList.add(elementActiveClass);
    }

    initCheckbox(checkboxWrapper) {
        // uncheck all checkboxes
        checkboxWrapper.checkboxes.forEach(function iterate(value, index, array) {
            value.checked = false;

            let label = value.nextElementSibling;

            // for Other label, add event listeners to the checkbox, but previous remove event listener
            // label is linked to the checkbox and there is no need to double event listener
            if (label.textContent === 'Other') {
                value.removeEventListener('click', this.checkboxOtherIsClickedBound);
                value.addEventListener('click', this.checkboxOtherIsClickedBound);
                this.removeOtherTextarea(value);
            }
        }, this);
    }

    // remove textarea for Other checkbox if exists
    removeOtherTextarea(otherCheckbox) {
        var otherTextarea = otherCheckbox.parentElement.nextElementSibling;
        var hasTextarea = otherTextarea ? otherTextarea.classList.contains(this.checkboxRowOtherClass) : false;

        if (hasTextarea) {
            let checkboxContainer = otherTextarea.parentElement;

            checkboxContainer.removeChild(otherTextarea);
        }
    }

    checkboxOtherIsClicked(event) {
        var checkbox = event.target;
        var otherIsChecked = checkbox.checked;
        var checkboxWrapper = checkbox.parentElement.parentElement;

        // add textarea for Other checkbox
        if (otherIsChecked) checkboxWrapper.append(this.createTextAreaForOtherCheckbox());

        // remove textarea for Other checkbox
        else checkboxWrapper.removeChild(checkboxWrapper.lastElementChild);
    }

    createTextAreaForOtherCheckbox() {
        var checkboxRow = document.createElement('div');
        var textarea = document.createElement('textarea');

        checkboxRow.classList.add('checkbox__row', this.checkboxRowOtherClass);
        textarea.classList.add('home__area');
        textarea.maxLength = "60";  // limit text length within textarea

        checkboxRow.append(textarea);

        return checkboxRow;
    }

    // for numbers use choices with given numbers class
    initNumbers(numbersWrapper) {
        this.initChoice(numbersWrapper, this.numbersActiveClass);
    }

    // get text for active element for choice or numbers with given active class
    getActiveText(inputElement, activeClass) {
        var activeElementFound, activeText;

        for (let i = 0; i < inputElement.choices.length; i++) {
            activeElementFound = inputElement.choices[i].classList.contains(activeClass);

            if (activeElementFound) {
                activeText = inputElement.choices[i].textContent.toLowerCase();
                break;
            }
        }

        // if there is no active element, return empty string
        return activeText ? activeText : '';
    }

    getTextFromSelectedCheckboxes(inputElement) {
        var checkboxesString = '';
        var newLines = /\n/g;
        var extraSpaces = /\s{2,}/g;  // more than one spaces

        inputElement.checkboxes.forEach(function iterate(value, index, array) {
            if (value.checked) {
                let checkboxString = value.nextElementSibling.textContent.toLowerCase();

                // remove new lines first and then replace more than one whitespaces with single whitespace
                let checkboxStringTrimmed = checkboxString.replace(newLines, ' ').replace(extraSpaces, ' ');

                checkboxesString += checkboxStringTrimmed;

                // for other checkbox, add text from other textarea
                if (checkboxStringTrimmed === 'other') {
                    let otherTextareaString = value.parentElement.nextElementSibling.firstElementChild.value;

                    // add textarea text only if it's not empty or filled with whitespaces only
                    // also remove new lines and trim whitespaces and extra spaces from textarea
                    if (!otherTextareaString.match(/^\s*$/g)) {
                        otherTextareaString = otherTextareaString.replace(newLines, ' ').replace(extraSpaces, ' ').trim();
                        checkboxesString += ' (' + otherTextareaString + ')';
                    }
                }

                checkboxesString += ', ';
            }
        }, this);

        // remove last comma and space
        return checkboxesString.slice(0, checkboxesString.length - 2);
    }
}