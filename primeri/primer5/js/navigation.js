// navigation


import { Score } from './score.js';
import { PagesContainer } from './pages/pages-container.js';
import { HomeAddress } from './pages/home-address.js';
import { IconClasses } from './icon-classes.js';
import { Validation } from './validation.js';
import { Submit } from './submit.js';

export class Navigation {

    constructor() {
        this.linkClass = 'navigation__link';
        this.homeContentClass = 'home__content';
        this.activeLinkClass = 'navigation__link--active';
        this.disabledBackButtonClass = 'score__button--back-disabled';
        this.buttonClass = 'score__button';
        this.buttonTextClass = 'score__text';
        this.iconClass = 'navigation__icon';
        this.textClass = 'navigation__text';
        this.homeWrapper = document.querySelector('.home__wrapper');
        this.links = document.querySelectorAll('.navigation .navigation__link');
        this.currentLink = this.links[0];
        this.previousLink = 0;

        let buttonsDOM = document.querySelectorAll('.' + this.buttonClass);

        this.buttons = {
            back: buttonsDOM[0],
            next: {
                button: buttonsDOM[1],
                buttonText: buttonsDOM[1].querySelector('.' + this.buttonTextClass),
                defaultText: 'Next',
                finishText: 'Finish'
            }
        }

        // cache HTML pages in array of objects (link, page)
        this.pages = [];

        // container for all pages
        this.pagesContainer = new PagesContainer();

        // object for score updates
        this.score = new Score(this.pagesContainer);

        // call page validation
        this.validation = new Validation(this.pagesContainer);

        // submit results
        this.submit = new Submit(this.score, this.pagesContainer, this);
    }

    addEventListeners() {
        this.cacheHomepage();
        this.addEvents();
        this.updatePageButtons();
        this.score.addEventListeners();
        this.resetIcons();
    }

    // don't fetch homepage later because it's already there when homepage is opened
    cacheHomepage() {
        var homepageLink = this.links[0];
        var homepage = document.querySelector('.' + this.homeContentClass);

        this.pages.push({
            link: homepageLink,
            page: homepage
        });

        var icon = homepageLink.querySelector('.' + this.iconClass);

        // create homepage (home address page) and init them
        this.pagesContainer.homeAddress = new HomeAddress(homepage, homepageLink, icon);
        this.pagesContainer.homeAddress.initPage();
    }

    // add event listeners for each navigation link on page and for buttons
    addEvents() {
        this.links.forEach(function iterate(value, key, parent) {
            value.addEventListener('click', this.linkIsClicked.bind(this));
        }, this);  // bind this pointer to the forEach function loop

        this.buttons.back.addEventListener('click', this.buttonIsClicked.bind(this));
        this.buttons.next.button.addEventListener('click', this.buttonIsClicked.bind(this));
    }

    async linkIsClicked(event) {
        event.preventDefault();

        var target = event.target;

        // init target to the link
        while (!target.classList.contains(this.linkClass))
            target = target.parentElement;

        var link = target.href;
        var linkIsAlreadyActive = target.classList.contains(this.activeLinkClass);

        // don't fetch page if it's already there
        if (linkIsAlreadyActive) return;

        this.previousLink = this.currentLink;

        // update current link
        this.currentLink = target;

        // wait until page is changed before validation to avoid blinking
        await this.changePage(link);
        this.validation.validatePage(this.previousLink);
        this.score.updateScore();
    }

    async changePage(link) {
        let cachedPageIndex = this.getIndexOfCurrentPageInCache();
        let pageAlreadyInCache = cachedPageIndex !== -1;

        this.updatePageButtons();

        // if page is cached, don't fetch it again
        if (pageAlreadyInCache) this.updatePageFromCache(cachedPageIndex);
        else {
            // fetch linked page via fetch api and wait until fetch is finished
            await fetch(link).then(this.pageIsFetched.bind(this))
                .then(this.pageText.bind(this))
                .catch(this.handleErrors.bind(this));
        }

        this.updateActiveLink();
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

        this.removeOldContentAddNew(pageContent);

        // cache HTML page for future use, save link also
        this.pages.push({
            link: this.currentLink,
            page: pageContent
        });

        // cache page in page container
        this.validation.getSetPage(this.currentLink, true, pageContent);
    }

    removeOldContentAddNew(newContent) {
        var oldContent = this.homeWrapper.querySelector('.' + this.homeContentClass);

        // remove old content from page and add new
        this.homeWrapper.removeChild(oldContent);
        this.homeWrapper.prepend(newContent);
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

    // if page is found in cache, return index of that page or -1 if it's not found
    getIndexOfCurrentPageInCache() {
        var indexOfPage = -1;

        for (let i = 0; i < this.pages.length; i++)
            if (this.pages[i].link === this.currentLink) {
                indexOfPage = i;
                break;
            }

        return indexOfPage;
    }

    // if page is in cache, then add them to the page from cache object, don't use ajax call twice
    updatePageFromCache(index) {
        var cachedPage = this.pages[index].page;

        this.removeOldContentAddNew(cachedPage);
    }

    // if it's first page, then disable back button, if it's last page 
    // then change text of next button
    updatePageButtons() {
        var isFirstPage = this.links[0] === this.currentLink;
        var isLastPage = this.links[this.links.length - 1] === this.currentLink;
        var backButtonDisabled = this.buttons.back.classList.contains(this.disabledBackButtonClass);
        var nextButtonFinish = this.buttons.next.buttonText.textContent === this.buttons.next.finishText;

        // don't disable twice back button
        if (isFirstPage) {
            this.buttons.next.buttonText.textContent = this.buttons.next.defaultText;

            if (!backButtonDisabled)
                this.buttons.back.classList.add(this.disabledBackButtonClass);
        }
        // enable back button and look for next button changes
        else {
            this.buttons.back.classList.remove(this.disabledBackButtonClass);

            // look for next button change
            if (isLastPage) {
                if (!nextButtonFinish)
                    this.buttons.next.buttonText.textContent = this.buttons.next.finishText
            }
            // it's neither first or last page
            else this.buttons.next.buttonText.textContent = this.buttons.next.defaultText;
        }
    }

    buttonIsClicked(event) {
        event.preventDefault();

        var target = event.target;

        // init target to the button
        while (!target.classList.contains(this.buttonClass))
            target = target.parentElement;

        var backButtonClicked = target === this.buttons.back;
        var nextButtonClicked = target === this.buttons.next.button;

        if (backButtonClicked) this.backButtonIsClicked(target);
        if (nextButtonClicked) this.nextButtonIsClicked(target);
    }

    async backButtonIsClicked(target) {
        var backButtonDisabled = target.classList.contains(this.disabledBackButtonClass);

        if (!backButtonDisabled) {
            this.previousLink = this.currentLink;

            // update current link and change page
            // wait for page to change (asynchronous call) and then validate
            this.currentLink = this.links[this.findCurrentLinkIndex() - 1];
            await this.changePage(this.currentLink.href);
            this.validation.validatePage(this.previousLink);
            this.score.updateScore();
        }
    }

    async nextButtonIsClicked(target) {
        var nextButtonText = target.querySelector('.' + this.buttonTextClass);
        var nextButtonFinished = nextButtonText.textContent === this.buttons.next.finishText;

        if (!nextButtonFinished) {
            this.previousLink = this.currentLink;

            // update current link
            // wait for page to change (asynchronous call) and then validate
            this.currentLink = this.links[this.findCurrentLinkIndex() + 1];
            await this.changePage(this.currentLink.href);
            this.validation.validatePage(this.previousLink);
            this.score.updateScore();
        }

        // it's last page and finish button is pressed
        // validate last page and then try to submit
        else {
            this.validation.validatePage(this.currentLink);
            this.score.updateScore();
            this.submit.tryToSubmit();
        }
    }

    findCurrentLinkIndex() {
        var index = -1;

        for (let i = 0; i < this.links.length; i++)
            if (this.links[i] === this.currentLink) {
                index = i;
                break;
            }

        return index;
    }

    // reset classes on links and icons and content of icons
    resetIcons() {
        this.links.forEach(function iterate(link, key, parent) {
            let icon = link.querySelector('.' + this.iconClass);
            icon.classList.remove(...IconClasses.checkCircleClasses);
            icon.classList.remove(...IconClasses.exclamationClasses);
            icon.classList.add(...IconClasses.circleClasses);

            link.classList.remove(IconClasses.linkOkClass);
            link.classList.remove(IconClasses.warningClass);
            link.classList.remove(this.activeLinkClass);
        }, this);

        // add active link to the first link
        this.links[0].classList.add(this.activeLinkClass);
    }

    // when Finish button is clicked, then show first page again
    async showFirstPage() {
        this.currentLink = this.links[0];
        await this.changePage(this.currentLink.href);
    }
}