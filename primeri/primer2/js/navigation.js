// main navigation on page


class Navigation {

    constructor() {
        this.navigations = document.getElementsByClassName('navigation');
        this.navigationLinks = document.getElementsByClassName('navigation__link');
        this.submenus = document.getElementsByClassName('submenu');
        this.activeSubmenuClass = 'submenu--active';
        this.lastActiveNavigation;
        this.mobileLink = document.getElementsByClassName('hamburger__link').item(0);
        this.mobileMenu = null;
        this.mobileMenuClass = 'mobile-menu';
        this.closeLinkClass = 'mobile-menu__close-link';
    }

    // add event listeners for navigations
    addListeners() {
        this.hideAllSubmenus();
        this.addEvents();
    }

    // hide all submenus from page
    hideAllSubmenus() {
        for (let i = 0; i < this.submenus.length; i++) {
            this.submenus[i].classList.remove(this.activeSubmenuClass);
        }
    }

    // add events to navigation links and mobile link
    addEvents() {
        for (let i = 0; i < this.navigationLinks.length; i++) {
            // bind this pointer to event handler function to use pointer for accessing class fields
            this.navigationLinks[i].addEventListener('click', this.eventHandler.bind(this));
        }

        // bind this pointer to the handler function
        this.mobileLink.addEventListener('click', this.mobileHandler.bind(this));
    }

    // event handler function for navigation links
    eventHandler(e) {
        e.preventDefault();

        // extract ID from navigation link, find that submenu and show them
        var target = e.target;
        var link = target.href;
        var idAll = link.split('/');
        var id = idAll[idAll.length - 1];
        var submenu = document.getElementById(id);

        // if last active navigation is not the same, then hide all submenus and show new one
        if (this.lastActiveNavigation !== target) {
            this.hideAllSubmenus();
            submenu.classList.add(this.activeSubmenuClass);
            this.lastActiveNavigation = target;
        }   
    }

    // handler for mobile menu
    mobileHandler(e) {
        e.preventDefault();

        // create mobile menu just once if it's not created already
        if (!this.mobileMenu) {
            this.mobileMenu = this.createMobileMenu();
        }

        var mobileMenu = document.getElementsByClassName(this.mobileMenuClass);

        // add mobile menu to the page if it's not already there
        if (!mobileMenu.length) document.body.append(this.mobileMenu);
    }

    // create mobile menu HTML
    createMobileMenu() {
        var mobile = document.createElement('div');
        var close = document.createElement('span');
        var closeLink = document.createElement('a');
        var closeIcon = document.createElement('i');
        var navigation = this.createNavigation(this.navigations.item(0));

        mobile.classList.add(this.mobileMenuClass);
        close.classList.add('mobile-menu__close');
        closeLink.classList.add(this.closeLinkClass);
        closeLink.href = 'index.html';
        closeIcon.classList.add('fas', 'fa-times', 'mobile-menu__close-icon');

        // bind this pointer to the handler function
        closeLink.addEventListener('click', this.closeLinkHandler.bind(this));
        
        mobile.append(close);
        close.append(closeLink);
        closeLink.append(closeIcon);
        mobile.append(navigation);

        return mobile;
    }

    // create navigation for mobile
    createNavigation(nav) {
        var navigation = document.createElement('ul');
        var items = nav.getElementsByClassName('navigation__item');
        var links = nav.getElementsByClassName('navigation__link');

        navigation.classList.add('mobile-menu__navigation');

        // copy link items and links from DOM
        for (let i = 0; i < items.length; i++) {
            let item = document.createElement('li');
            let link = document.createElement('a');
            let text = document.createElement('span');
            let dropdown = document.createElement('i');

            item.classList.add('mobile-menu__navigation-item');
            link.classList.add('mobile-menu__navigation-link');
            link.href = 'index.html';

            // send this pointer to handler function via bind
            link.addEventListener('click', this.dropdownHandler.bind(this));

            text.classList.add('mobile-menu__navigation-text');
            text.textContent = links[i].textContent;
            dropdown.classList.add('fas', 'fa-angle-down', 'mobile-menu__navigation-dropdown');

            // create submenu from DOM copy
            let submenu = this.createSubmenu(i);

            item.append(link);
            item.append(submenu);
            link.append(text);
            link.append(dropdown);
            navigation.append(item);
        }
        
        return navigation;
    }

    // handler for dropdown mobile menu
    dropdownHandler(e) {
        e.preventDefault();

        var target = e.target;
        var notLink = !target.classList.contains('mobile-menu__navigation-link');

        // set target to link
        if (notLink) target = target.parentElement;

        var dropdown = target.getElementsByClassName('mobile-menu__navigation-dropdown').item(0);
        var submenu = target.nextElementSibling;

        // toggle dropdown arrows and show/hide submenu
        if (dropdown.classList.contains('fa-angle-down')) {
            dropdown.classList.remove('fa-angle-down');
            dropdown.classList.add('fa-angle-up');
            submenu.classList.add('mobile-menu__submenu--active');
        }
        else {
            dropdown.classList.remove('fa-angle-up');
            dropdown.classList.add('fa-angle-down');
            submenu.classList.remove('mobile-menu__submenu--active');
        }

        // close other dropdowns
        this.closeOtherDropdowns(dropdown);
    }

    // close other dropdowns except one given as argument or close all dropdowns
    closeOtherDropdowns(dropdown, closeAll = false) {
        var other = document.getElementsByClassName('mobile-menu__navigation-dropdown');
        var submenu;

        for (let i = 0; i < other.length; i++) {
            let closeOther = !closeAll && (other[i] !== dropdown);

            // close other dropdown or close all
            if (closeOther || closeAll) {
                if (other[i].classList.contains('fa-angle-up')) {
                    other[i].classList.remove('fa-angle-up');
                    other[i].classList.add('fa-angle-down');

                    submenu = other[i].parentElement.nextElementSibling;
                    submenu.classList.remove('mobile-menu__submenu--active');
                }
            }
        }
    }

    // create submenu for mobile
    createSubmenu(index) {
        var list = document.createElement('ul');
        var items = this.submenus[index].getElementsByClassName('submenu__item');
        var links = this.submenus[index].getElementsByClassName('submenu__link');

        list.classList.add('mobile-menu__submenu');

        // copy submenu from DOM
        for (let i = 0; i < items.length; i++) {
            let item = document.createElement('li');
            let link = document.createElement('a');

            item.classList.add('mobile-menu__submenu-item');
            link.classList.add('mobile-menu__submenu-link');
            link.href = links[i].href;
            link.textContent = links[i].textContent;

            item.append(link);
            list.append(item);
        }

        return list;
    }

    // event handler for close link for mobile menu
    closeLinkHandler(e) {
        e.preventDefault();

        // close all dropdowns before closing
        this.closeOtherDropdowns(null, true);

        // remove mobile menu from the page
        this.mobileMenu.remove();
    }
}



// add event listeners for navigation
(function addEventListeners() {

    var navigation = new Navigation();
    navigation.addListeners();

}());