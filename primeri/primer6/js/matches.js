// matches results for livesearch


export default class Matches {

    constructor(searchElement) {
        let matchesElementsHTML = this.createMatchesElementsHTML();

        this.matchesPage = $('.matches');

        this.matches = {
            number: matchesElementsHTML.numberElement,
            text: matchesElementsHTML.textElement,
            search: matchesElementsHTML.searchElement,
            close: {
                element: matchesElementsHTML.closeElement,
                icon: matchesElementsHTML.iconElement
            }
        }

        this.search = searchElement;

        // remove matches elements and search results from page when close icon is clicked
        $(this.matches.close.icon).on('click', this.removeAllSearchResults.bind(this));
    }

    createMatchesElementsHTML() {
        var number = $('<span>').addClass('matches__number col-auto').text('0');
        var text = $('<span>').addClass('matches__text col-auto d-flex align-items-center').text('matches found for');
        var search = $('<span>').addClass('matches__search col-auto');
        var close = $('<span>').addClass('matches__close col-auto d-flex align-items-center');
        var icon = $('<i>').addClass('fas fa-times matches__icon');

        close.append(icon);

        return {
            numberElement: number,
            textElement: text,
            searchElement: search,
            closeElement: close,
            iconElement: icon
        };
    }

    // add livesearch results to the page
    addElementsToPage(numberOfResults, searchResults) {
        var matchesElementsOnPage = this.matchesPage[0].children.length;

        // add results to the elements
        this.matches.number.text(`${numberOfResults}`);
        this.matches.search.text(searchResults);

        // add elements to the page if they are not already there
        if (!matchesElementsOnPage)
            this.matchesPage.append(this.matches.number).append(this.matches.text)
                            .append(this.matches.search).append(this.matches.close.element);
    }

    // remove livesearch results from page
    // just remove elements from page, but don't remove events
    removeElementsFromPage() {
        $(this.matches.number).detach();
        $(this.matches.text).detach();
        $(this.matches.search).detach();
        $(this.matches.close.element).detach();
    }

    // click on search delete icon to fire event to remove search results and matches elements
    removeAllSearchResults() {
        this.search.deleteIcon.click();
    }
}