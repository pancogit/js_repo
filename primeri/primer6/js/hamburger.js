// hamburger menu


export default class Hamburger {

    constructor(navigationObject) {
        this.navigation = $(navigationObject);
        this.navigationCloseButton = this.navigation.find('.navigation__close');
        this.button = $('.hamburger__button');
        this.icon = this.button.find('.hamburger__icon');
        this.closeClass = 'hamburger__icon--close';
        this.navigationHideClass = 'navigation--hide';
    }

    addListeners() {
        this.button.on('click', this.showHideNavigation.bind(this));
        this.navigationCloseButton.on('click', this.hideNavigation.bind(this))
    }

    showHideNavigation(event) {
        var iconClosed = this.icon.hasClass(this.closeClass);

        // return icon to normal position and show navigation
        if (iconClosed) {
            this.icon.removeClass(this.closeClass);
            this.navigation.removeClass(this.navigationHideClass);
        }
        // rotate icon and hide navigation
        else this.hideNavigation(event);
    }

    hideNavigation(event) {
        this.icon.addClass(this.closeClass);
        this.navigation.addClass(this.navigationHideClass);
    }
}