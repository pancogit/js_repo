// navigation


export class Navigation {

    constructor() {
        this.linkClass = 'navigation__link';
        this.homeContentClass = 'home__content';
        this.activeLinkClass = 'navigation__link--active';
        this.homeWrapper = document.querySelector('.home__wrapper');
        this.links = 0;
        this.currentLink = 0;
    }

    addEventListeners() {
        this.addEvents();
    }

    addEvents() {
        this.links = document.querySelectorAll('.navigation .navigation__link');

        // add event listeners for each navigation link on page
        this.links.forEach(function iterate(value, key, parent) {
            value.addEventListener('click', this.linkIsClicked.bind(this));
        }, this);
    }

    linkIsClicked(event) {
        event.preventDefault();

        var target = event.target;

        // init target to the link
        while (!target.classList.contains(this.linkClass))
            target = target.parentElement;
        
        var link = target.href;
        var linkIsAlreadyActive = target.classList.contains(this.activeLinkClass);

        // don't fetch page if it's already there
        if (linkIsAlreadyActive) return;

        // update current link
        this.currentLink = target;

        // fetch linked page via fetch api
        fetch(link).then(this.pageIsFetched.bind(this))
                   .then(this.pageText.bind(this))
                   .catch(this.handleErrors.bind(this));
    }

    // return resolved promise with text of page or rejected promise with error message
    pageIsFetched(response) {
        if (response.ok) 
            return response.text();
        else
            return Promise.reject(new Error('HTML page [' + response.url + '] is not fetched!'));
    }

    pageText(responseText) {
        var pageWrapper = document.createElement('div');
        var pageContent;

        // convert server response text to HTML
        pageWrapper.innerHTML = responseText;
        pageContent = pageWrapper.querySelector('.' + this.homeContentClass);
        
        var oldContent = this.homeWrapper.querySelector('.' + this.homeContentClass);

        // remove old content from page and add new
        this.homeWrapper.removeChild(oldContent);
        this.homeWrapper.prepend(pageContent);

        this.updateActiveLink();
    }

    handleErrors(reason) {
        console.error(reason);
    }

    updateActiveLink() {
        this.removeActiveLink();
        this.currentLink.classList.add(this.activeLinkClass);
    }

    removeActiveLink() {
        for (let i = 0; i < this.links.length; i++)
            if (this.links[i].classList.contains(this.activeLinkClass)) {
                this.links[i].classList.remove(this.activeLinkClass);
                break;
            }
    }
}