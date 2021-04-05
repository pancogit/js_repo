// navigation


import { Score } from './score.js';
import { PagesContainer } from './pages/pages-container.js';
import { HomeAddress } from './pages/home-address.js';
import { PhoneNumbers } from './pages/phone-numbers.js';
import { Email } from './pages/email.js';
import { EmergencyContact } from './pages/emergency-contact.js';
import { RaceEthnicity } from './pages/race-ethnicity.js';
import { Gender } from './pages/gender.js';
import { HeightWeight } from './pages/height-weight.js';
import { Pharmacy } from './pages/pharmacy.js';
import { Questionnaire } from './pages/questionnaire.js';
import { CurrentInfo } from './pages/current-info.js';
import { Allergies } from './pages/allergies.js';
import { MedicalCondition } from './pages/medical-condition.js';

export class Navigation {

    constructor() {
        this.linkClass = 'navigation__link';
        this.homeContentClass = 'home__content';
        this.activeLinkClass = 'navigation__link--active';
        this.disabledBackButtonClass = 'score__button--back-disabled';
        this.buttonClass = 'score__button';
        this.buttonTextClass = 'score__text';
        this.iconClass = 'navigation__icon';
        this.checkCircleClasses = ['fas', 'fa-check-circle'];
        this.circleClasses = ['far', 'fa-circle'];
        this.exclamationClasses = ['fas', 'fa-exclamation-circle'];
        this.linkOkClass = 'navigation__link--ok';
        this.warningClass = 'navigation__link--warning';
        this.textClass = 'navigation__text';
        this.homeWrapper = document.querySelector('.home__wrapper');
        this.links = document.querySelectorAll('.navigation .navigation__link');
        this.currentLink = this.links[0];

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

        // object for score update
        this.score = new Score();

        // container for all pages
        this.pagesContainer = new PagesContainer();
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

        var previousLink = this.currentLink;

        // update current link
        this.currentLink = target;

        this.changePage(link);
        this.validatePage(previousLink);
    }

    changePage(link) {
        let cachedPageIndex = this.getIndexOfCurrentPageInCache();
        let pageAlreadyInCache = cachedPageIndex !== -1;

        this.updatePageButtons();

        // if page is cached, don't fetch it again
        if (pageAlreadyInCache) this.updatePageFromCache(cachedPageIndex);
        else {
            // fetch linked page via fetch api
            fetch(link).then(this.pageIsFetched.bind(this))
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

    backButtonIsClicked(target) {
        var backButtonDisabled = target.classList.contains(this.disabledBackButtonClass);

        if (!backButtonDisabled) {
            let previousLink = this.currentLink;

            // update current link and change page
            this.currentLink = this.links[this.findCurrentLinkIndex() - 1];
            this.changePage(this.currentLink.href);
            this.validatePage(previousLink);
        }
    }

    nextButtonIsClicked(target) {
        var nextButtonText = target.querySelector('.' + this.buttonTextClass);
        var nextButtonFinished = nextButtonText.textContent === this.buttons.next.finishText;

        if (!nextButtonFinished) {
            let previousLink = this.currentLink;

            // update current link
            this.currentLink = this.links[this.findCurrentLinkIndex() + 1];
            this.changePage(this.currentLink.href);
            this.validatePage(previousLink);
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
            icon.classList.remove(...this.checkCircleClasses);
            icon.classList.remove(...this.exclamationClasses);
            icon.classList.add(...this.circleClasses);

            link.classList.remove(this.linkOkClass);
            link.classList.remove(this.warningClass);
            link.classList.remove(this.activeLinkClass);
        }, this);

        // add active link to the first link
        this.links[0].classList.add(this.activeLinkClass);
    }

    validatePage(link) {
        var page = this.getPage(link);

        if (page) page.validatePage();
    }

    getPage(link) {
        var page;
        var linkText = link.querySelector('.' + this.textClass).textContent;

        switch (linkText) {
            case 'Home address':
                page = this.pagesContainer.homeAddress;
                break;

            case 'Phone numbers':
                page = this.pagesContainer.phoneNumbers;
                break;

            case 'Email':
                page = this.pagesContainer.email;
                break;

            case 'Emergency contact':
                page = this.pagesContainer.emergencyContact;
                break;

            case 'Race/Ethnicity':
                page = this.pagesContainer.raceEthnicity;
                break;

            case 'Gender':
                page = this.pagesContainer.gender;
                break;

            case 'Height & weight':
                page = this.pagesContainer.heightWeight;
                break;

            case 'Pharmacy':
                page = this.pagesContainer.pharmacy;
                break;

            case 'Questionnaire':
                page = this.pagesContainer.questionnaire;
                break;

            case 'Current info':
                page = this.pagesContainer.currentInfo;
                break;

            case 'Allergies':
                page = this.pagesContainer.allergies;
                break;

            case 'Medical condition':
                page = this.pagesContainer.medicalCondition;
                break;

            default:
                page = 0;
                break;
        }

        return page;
    }
}