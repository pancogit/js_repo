// navigation


// import class for dropdown
import { Dropdown } from './dropdown.js';

export class Navigation {

    constructor() {
        this.hamburgerLink = document.getElementsByClassName('hamburger__link').item(0);
        this.hamburgerIcon = document.getElementsByClassName('hamburger__icon').item(0);
        this.close = document.getElementsByClassName('navigation__close-link').item(0);
        this.navigation = document.getElementsByClassName('navigation').item(0);
        this.navigationClass = 'navigation';
        this.moveInClass = 'navigation__move-in';
        this.dropdown = new Dropdown();
    }

    // add event listeners for mobile navigation
    mobileNavigation() {
        // send this pointer to handler function via bind
        this.hamburgerLink.addEventListener('click', this.showNavigation.bind(this));
        this.close.addEventListener('click', this.hideNavigation.bind(this));

        // add event listeners for dropdown
        this.dropdown.dropdownMenu();

        // add event listener on window object when outside of navigation 
        // is clicked to close all dropdowns
        window.addEventListener('click', this.closeDropdowns.bind(this));
    }

    showNavigation(e) {
        e.preventDefault();

        // show navigation by adding simple class
        this.navigation.classList.add(this.moveInClass);

        // also close all dropdown menus if they are previously opened in desktop navigation
        this.dropdown.hideLists(true);
    }

    hideNavigation(e) {
        e.preventDefault();

        // hide navigation by removing class
        this.navigation.classList.remove(this.moveInClass);

        // also close all dropdown menus
        this.dropdown.hideLists(true);
    }

    closeDropdowns(e) {
        var target = e.target;
        var currentElement = target;
        var navigationFound = false;

        // search backwards to top for navigation
        while (currentElement) {
            navigationFound = currentElement.classList.contains(this.navigationClass);
            if (navigationFound) break;

            currentElement = currentElement.parentElement;
        }

        // if outside of navigation is clicked close all dropdowns
        if (!navigationFound) this.dropdown.hideLists(true);
    }
}