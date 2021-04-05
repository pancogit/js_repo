// page


export class Page {

    constructor(pageObject, linkObject, iconObject) {
        this.page = pageObject;
        this.link = linkObject;
        this.icon = iconObject;
    }

    initPage() {
        
    }

    validatePage() {

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
}