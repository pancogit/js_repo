// pharmacy page


import { Page } from './page.js';

export class Pharmacy extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);
    }

    initPage() {
        super.initPage();
    }

    validatePage() {
        super.validatePage();

        this.isPageValid();
        this.updatePageIcon();
        this.updateNumberOfValidElements();
    }

    // update valid flag for whole page
    isPageValid() {
        super.isPageValid();
    }

    updateNumberOfValidElements() {
        super.updateNumberOfValidElements();
    }
}