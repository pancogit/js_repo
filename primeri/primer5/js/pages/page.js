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

        // validation utilities
        this.pageValidation = new PageValidation();
    }

    initPage() {
        
    }

    validatePage() {

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
    initChoice(choiceWrapper) {
        choiceWrapper.choices.forEach(function iterate(value, index, array) {
            value.classList.remove(this.choiceActiveClass);

            // send this pointer to the event handler via bind
            value.addEventListener('click', this.updateChoice.bind(this, choiceWrapper.choices));
        }, this);
    }

    updateChoice(choices, event) {
        var target = event.target;
        var targetAlreadyActive = target.classList.contains(this.choiceActiveClass);

        // don't do anything if the same choice is clicked
        if (targetAlreadyActive) return;

        // remove active choice and then update current choice
        choices.forEach(function iterate(value, index, array) {
            value.classList.remove(this.choiceActiveClass);
        }, this);

        target.classList.add(this.choiceActiveClass);
    }

    initCheckbox(checkboxWrapper) {
        // uncheck all checkboxes
        checkboxWrapper.checkboxes.forEach(function iterate(value, index, array) {
            value.checked = false;

            let label = value.nextElementSibling;

            // for Other label, add event listeners to the checkbox
            // label is linked to the checkbox and there is no need to double event listener
            if (label.textContent === 'Other') 
                value.addEventListener('click', this.checkboxOtherIsClicked.bind(this));
        }, this);
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

        checkboxRow.classList.add('checkbox__row', 'checkbox__row--other');
        textarea.classList.add('home__area');
        textarea.maxLength = "60";  // limit text length within textarea

        checkboxRow.append(textarea);

        return checkboxRow;
    }
}