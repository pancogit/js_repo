// header


export default class Header {

    constructor(filesObject) {
        this.files = filesObject;

        let view = $('.header__icon--view');
        let sort = $('.header__icon--sort');
        let theme = $('.header__icon--theme');
        let expand = $('.fa-expand-alt');

        this.viewClasses = {
            large: 'fas fa-square header__icon header__icon--view',
            medium: 'fas fa-th-large header__icon header__icon--view',
            small: 'fas fa-th header__icon header__icon--view'
        }

        this.iconView = {
            icon: view,
            link: view.parent(),
            currentClass: this.viewClasses.medium
        }

        this.sortClasses = {
            ascending: 'fas fa-sort-alpha-down header__icon header__icon--sort',
            descending: 'fas fa-sort-alpha-up header__icon header__icon--sort'
        }

        this.iconSort = {
            icon: sort,
            link: sort.parent(),
            currentClass: this.sortClasses.ascending
        }

        this.themeClasses = {
            dark: 'home__content--dark',
            night: 'home__content--night',
            default: ''
        }

        this.iconTheme = {
            icon: theme,
            link: theme.parent(),
            currentClass: this.themeClasses.night,
            content: $('.home__content')
        }

        this.expandClasses = {
            expand: 'fas fa-expand-alt header__icon',
            compress: 'fas fa-compress-alt header__icon'
        }

        this.iconExpand = {
            icon: expand,
            link: expand.parent(),
            currentClass: this.expandClasses.expand,
        }

        this.fullscreenMode = false;
    }

    addListeners() {
        this.iconView.link.on('click', this.changeGridView.bind(this));
        this.iconSort.link.on('click', this.sortFolder.bind(this));
        this.iconTheme.link.on('click', this.changeHomeContentTheme.bind(this));

        // add event listeners for fullscreen
        // change fullscreen with click, F11 or escape button
        this.iconExpand.link.on('click', this.changeFullscreen.bind(this));
        $(window).on('fullscreenchange', this.fullscreenChanged.bind(this));
        //$(window).on('keydown', this.fullscreenKeyboard.bind(this));
    }

    changeGridView(event) {
        event.preventDefault();

        // change icon to the next in round
        this.changeNextIcon();

        // update files grid view on files component
        this.files.changeFilesGridView();
    }

    changeNextIcon() {
        this.iconView.icon.removeClass(this.iconView.currentClass);

        switch (this.iconView.currentClass) {
            case this.viewClasses.large:
                this.iconView.icon.addClass(this.viewClasses.medium);
                this.iconView.currentClass = this.viewClasses.medium;
                break;

            case this.viewClasses.medium:
                this.iconView.icon.addClass(this.viewClasses.small);
                this.iconView.currentClass = this.viewClasses.small;
                break;

            case this.viewClasses.small:
                this.iconView.icon.addClass(this.viewClasses.large);
                this.iconView.currentClass = this.viewClasses.large;
                break;

            default: break;
        }
    }

    sortFolder(event) {
        event.preventDefault();

        var isAscending = this.iconSort.currentClass === this.sortClasses.ascending;
        var isDescending = this.iconSort.currentClass === this.sortClasses.descending;

        this.iconSort.icon.removeClass(this.iconSort.currentClass);

        if (isAscending) 
            this.iconSort.currentClass = this.sortClasses.descending;
        else if (isDescending) 
            this.iconSort.currentClass = this.sortClasses.ascending;

        this.iconSort.icon.addClass(this.iconSort.currentClass);

        // sort folder from DOM
        this.files.sortFolder(isAscending ? 0 : 1);
    }

    // change themes in round
    changeHomeContentTheme(event) {
        event.preventDefault();

        this.iconTheme.content.removeClass(this.iconTheme.currentClass);

        // update home content theme on page
        switch (this.iconTheme.currentClass) {
            case this.themeClasses.night:
                this.iconTheme.content.addClass(this.themeClasses.dark);
                this.iconTheme.currentClass = this.themeClasses.dark;
                break;

            case this.themeClasses.dark:
                this.iconTheme.content.addClass(this.themeClasses.default);
                this.iconTheme.currentClass = this.themeClasses.default;
                break;

            case this.themeClasses.default:
                this.iconTheme.content.addClass(this.themeClasses.night);
                this.iconTheme.currentClass = this.themeClasses.night;
                break;

            default: break;
        }
    }

    // go to fullscreen or exit from them on click
    changeFullscreen(event) {
        event.preventDefault();

        this.fullscreenMode = document.fullscreenElement ? true : false;
        this.iconExpand.icon.removeClass(this.iconExpand.currentClass);

        // exit from fullscreen and change icon
        if (document.fullscreenElement) {
            document.exitFullscreen();
            this.iconExpand.icon.addClass(this.expandClasses.expand);
        }

        // go to fullscreen and change icon
        else {
            document.documentElement.requestFullscreen();
            this.iconExpand.icon.addClass(this.expandClasses.compress);
        }
    }

    // exit from fullscreen and change icon because if fullscreen is entered with click, 
    // then if escape key is pressed, it will not be detected by handler even if keyboard event is used
    // because of that, no matter what's going on, when fullscreen mode is changed 
    // then change icon for fullscreen
    fullscreenChanged(event) {
        this.fullscreenMode = document.fullscreenElement ? true : false;

        // when fullscreen is leaved, just change icon to normal expanded
        if (!document.fullscreenElement) this.leaveFullscreenIcons();

        // when fullscreen is entered, change icon also
        else if (document.fullscreenElement) this.enterFullscreenIcons();
    }

    enterFullscreenIcons() {
        this.iconExpand.icon.removeClass(this.expandClasses.expand);
        this.iconExpand.icon.addClass(this.expandClasses.compress);
    }

    leaveFullscreenIcons() {
        this.iconExpand.icon.removeClass(this.expandClasses.compress);
        this.iconExpand.icon.addClass(this.expandClasses.expand);
    }

    // detect when F11 is pressed to change fullscreen mode
    fullscreenKeyboard(event) {
        event.preventDefault();

        var f11Pressed = event.key === 'F11';

        if (f11Pressed) {
            if (this.fullscreenMode) {
                document.exitFullscreen();
                this.leaveFullscreenIcons();
            }
            else {
                document.documentElement.requestFullscreen();
                this.enterFullscreenIcons();
            }

            this.fullscreenMode = !this.fullscreenMode;
        }
    }

    // set default icon for sorting in ascending order
    setDefaultSortIcon() {
        var isAscending = this.iconSort.currentClass === this.sortClasses.ascending;

        // set ascending icon for sorting only if it's not already ascending
        if (!isAscending) {
            this.iconSort.icon.removeClass(this.iconSort.currentClass);
            this.iconSort.currentClass = this.sortClasses.ascending;
            this.iconSort.icon.addClass(this.iconSort.currentClass);
        }
    }
}