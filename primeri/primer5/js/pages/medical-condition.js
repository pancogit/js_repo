// medical condition page


import { Page } from './page.js';

export class MedicalCondition extends Page {

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
    }
}