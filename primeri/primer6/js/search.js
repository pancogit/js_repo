// search files and folders


import Matches from './matches.js';

export default class Search {

    constructor(data) {
        this.serverData = data;
        this.search = $('.search');
        this.textBox = this.search.find('.search__box');
        this.deleteBox = this.search.find('.search__delete');
        this.deleteIcon = this.deleteBox.find('.search__icon');
        this.activeClass = 'search--active';
        this.deleteHideClass = 'search__delete--hidden';

        // search results
        this.matches = new Matches(this);
    }

    addListeners() {
        // add event listeners on text input
        this.textBox.on('input', this.textBoxTyping.bind(this));
        $(window).on('click', this.textBoxFocus.bind(this));

        // add event listener to clear text input when clicked
        this.deleteIcon.on('click', this.clearTextBox.bind(this));
    }

    // when it's clicked out of search component, then it's not active anymore
    // blur event cannot be used because text input has wrapper around them with more elements
    // and in that case borders can be inactive even if it's clicked inside search component
    // also use click event to set search active, because if it's clicked out of textbox, 
    // but still inside search component, then it will not be detected as focus event
    textBoxFocus(event) {
        var target = event.target;
        var searchFound = ($.contains(this.search[0], target)) || (this.search[0] === target);

        // if clicked element is not child of search element or search element itself, 
        // then remove active borders, otherwise set active borders
        if (!searchFound) this.search.removeClass(this.activeClass);
        else this.search.addClass(this.activeClass);
    }

    textBoxTyping(event) {
        var textBoxContent = this.textBox.val();
        var emptyTextBox = textBoxContent === '';

        // detect only spaces with regular expression
        var onlySpacesTextBox = textBoxContent.match(/^\s*$/);
        
        // show / hide delete box for text input
        if (emptyTextBox) this.deleteBox.addClass(this.deleteHideClass);
        else this.deleteBox.removeClass(this.deleteHideClass);

        // remove or add search results to the page
        if (onlySpacesTextBox) this.matches.removeElementsFromPage();
        else this.matches.addElementsToPage(0, this.textBox.val());
    }

    // clear text input and hide delete icon
    clearTextBox(event) {
        this.textBox.val('');
        this.deleteBox.addClass(this.deleteHideClass);

        // remove search results to the page
        this.matches.removeElementsFromPage();
    }
}