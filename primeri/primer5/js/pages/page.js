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

        // validation utilities
        this.pageValidation = new PageValidation();
    }

    initPage() {
        
    }

    validatePage() {

    }

    isPageValid() {

    }

    updateNumberOfValidElements() {

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
}