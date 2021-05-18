// navigation


import Size from './size.js';
import Files from './files.js';

export default class Navigation {

    constructor(data) {
        this.serverData = data;
        this.navigationClass = 'navigation';
        this.navigationActiveLinkClass = 'navigation__link--active';
        this.navigationIconClass = 'navigation__icon';
        this.navigationSignClass = 'navigation__sign';
        this.folderPlusClass = 'fa-folder-plus';
        this.folderMinusClass = 'fa-folder-minus';
        this.signPlusClass = 'fa-plus';
        this.signMinusClass = 'fa-minus';
        this.navigation = 0;
        this.currentActiveLink = 0;

        this.size = new Size();
        this.files = new Files();
    }

    add() {
        this.removeStaticData();
        this.addNavigation();

        // add home folder content at the beginning
        this.files.addToPage(this.serverData.home);
    }

    removeStaticData() {
        $(`.${this.navigationClass}`).remove();
    }

    addNavigation() {
        var navigation = $('<aside>').addClass(this.navigationClass + ' page__aside');
        var exit = $('<div>').addClass('navigation__exit');
        var close = $('<i>').addClass('fas fa-times navigation__close');
        var list = $('<ul>').addClass('navigation__list');

        this.addFolders(list, this.serverData.home.folders);

        navigation.append(exit);
        navigation.append(list);
        exit.append(close);

        this.navigation = navigation;

        // add navigation to the page
        $('.home').parent().prepend(this.navigation);
    }

    // loop through server data and add folders in tree structure
    addFolders(list, folders) {

        folders.forEach(function iterate(value, index, array) {
            let item = $('<li>').addClass('navigation__item');
            let link = $('<a>').addClass('navigation__link');
            let box = $('<div>').addClass('navigation__box d-flex align-items-center flex-nowrap');
            let folder = $('<i>').addClass(this.navigationIconClass + ' col-auto');
            let text = $('<span>').addClass('navigation__text col').text(value.name);
            let nestedFolders = value.folders.length;

            // if folder contain any folders, then add plus icon and plus element next to the text
            // otherwise add just simple folder icon
            if (nestedFolders) {
                folder.addClass('fas fa-folder-plus');

                $('<span>').addClass('navigation__expand col-auto').append(
                    $('<i>').addClass('fas fa-plus ' + this.navigationSignClass)
                ).appendTo(box);

                // add nested folders recursively
                let submenu = $('<ul>').addClass('navigation__submenu');
                item.append(submenu);
                this.addFolders(submenu, value.folders);
            }
            else folder.addClass('fas fa-folder');

            link[0].href = value.info.path;

            // bind this pointer to asynchronous event call
            $(link).on('click', this.folderIsClicked.bind(this));

            item.prepend(link);
            link.append(box);
            box.prepend(text);
            box.prepend(folder);
            list.append(item);
        }, this);

    }

    folderIsClicked(event) {
        event.preventDefault();

        var linkObject = event.currentTarget;

        this.expandHideFolders(linkObject);

        // don't do anything if the same link is clicked
        if (this.currentActiveLink[0] === linkObject) return;

        var linkString = linkObject.pathname;
        var folder = this.findFolder(linkString, this.serverData.home.folders);

        // add files on page and update folder size on page
        this.files.addToPage(folder);
        this.size.updateOnPage(folder);

        this.updateActiveLink(linkObject);
    }

    // expand folders from navigation or hide them
    expandHideFolders(link) {
        var icon = $(link).find(`.${this.navigationIconClass}`);
        var expanded = icon.hasClass(this.folderPlusClass);
        var sign = $(link).find(`.${this.navigationSignClass}`);

        // return back maximum height content of submenu
        var submenu = $(link).next();
        var submenuExists = submenu.length;
        var submenuMaxHeight = submenuExists ? submenu[0].scrollHeight : 0;

        if (submenuExists) {
            if (expanded) {
                icon.removeClass(this.folderPlusClass);
                icon.addClass(this.folderMinusClass);
                sign.removeClass(this.signPlusClass);
                sign.addClass(this.signMinusClass);

                // show submenu
                submenu.css('max-height', submenuMaxHeight);
            }
            else {
                icon.removeClass(this.folderMinusClass);
                icon.addClass(this.folderPlusClass);
                sign.removeClass(this.signMinusClass);
                sign.addClass(this.signPlusClass);

                // hide submenu
                submenu.css('max-height', '0');
            }
        }
    }

    // deep search the tree structure and find folder with given link
    findFolder(link, folders) {
        var folderFound = 0;

        for (let i = 0; i < folders.length; i++) {
            let linkFound = link === folders[i].info.path;

            // return found folder if it's found and don't search further
            if (folderFound) return folderFound;

            // if link is found, return cached folder from tree structure
            if (linkFound) return folders[i];
            else folderFound = this.findFolder(link, folders[i].folders);
        }

        // folder is not found
        return folderFound;
    }

    // remove last active link and activate new link
    updateActiveLink(link) {
        $(link).addClass(this.navigationActiveLinkClass);

        if (this.currentActiveLink)
            this.currentActiveLink.removeClass(this.navigationActiveLinkClass);

        this.currentActiveLink = $(link);
    }
}