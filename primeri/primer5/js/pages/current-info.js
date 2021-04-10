// current info page


import { Page } from './page.js';

export class CurrentInfo extends Page {

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