// navigation


import Size from './size.js';
import Files from './files.js';

export default class Navigation {

    constructor(data, breadcrumbsObject) {
        this.serverData = data;
        this.breadcrumbs = breadcrumbsObject;

        this.navigationClass = 'navigation';
        this.navigationActiveLinkClass = 'navigation__link--active';
        this.navigationIconClass = 'navigation__icon';
        this.navigationSignClass = 'navigation__sign';
        this.navigationSubmenuClass = 'navigation__submenu';
        this.navigationSubmenuExpandedClass = 'navigation__submenu--expanded';
        this.folderPlusClass = 'fa-folder-plus';
        this.folderMinusClass = 'fa-folder-minus';
        this.signPlusClass = 'fa-plus';
        this.signMinusClass = 'fa-minus';
        this.navigation = 0;
        this.currentActiveLink = 0;

        this.size = new Size();
        this.files = new Files();
    }

    add(restoreHomepage = false) {
        // when homepage breadcrumb is clicked, go to homepage
        // remove active navigation link and restore all folders, don't keep then expanded
        if (restoreHomepage) {
            this.closeFolders();

            // remove active link
            this.currentActiveLink.removeClass(this.navigationActiveLinkClass);
            this.currentActiveLink[0] = 0;
        }
        else {
            this.removeStaticData();
            this.addNavigation();
        }
        
        // add home folder content at the beginning
        this.files.addToPage(this.serverData.home);

        // update size for homepage when page is loaded
        this.size.updateOnPage(this.serverData.home);
    }

    // close all folders on homepage
    closeFolders() {
        var submenus = $(`.${this.navigationSubmenuClass}`);

        // hide all submenus and restore icons
        for (let i = 0; i < submenus.length; i++) {
            let jElement = $(submenus[i]);
            jElement.removeClass(this.navigationSubmenuExpandedClass);

            let link = jElement.prev();
            let icon = link.find(`.${this.navigationIconClass}`);
            let sign = link.find(`.${this.navigationSignClass}`);

            icon.removeClass(this.folderMinusClass);
            icon.addClass(this.folderPlusClass);

            sign.removeClass(this.signMinusClass);
            sign.addClass(this.signPlusClass);
        }
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

            // format very long names with tree dots at the end
            let text = $('<span>').addClass('navigation__text col').text(this.files.formatName(value.name));

            // save navigation link for server data
            value.link = link[0];

            // add plus for nested folders or just plain folder
            this.addFolderIcon(value, folder, box, item);

            // format url of link to be valid url
            link[0].href = this.files.formatURL(value.info.path);

            // bind this pointer to asynchronous event call
            $(link).on('click', this.folderIsClicked.bind(this));

            item.prepend(link);
            link.append(box);
            box.prepend(text);
            box.prepend(folder);
            list.append(item);
        }, this);

    }

    // add plus icon next to the folder or just plain folder icon
    addFolderIcon(folderObject, folderElement, boxElement, listItemElement) {
        var nestedFolders = folderObject.folders.length;

        // if folder contain any folders, then add plus icon and plus element next to the text
        // otherwise add just simple folder icon
        if (nestedFolders) {
            folderElement.addClass('fas fa-folder-plus');

            $('<span>').addClass('navigation__expand col-auto').append(
                $('<i>').addClass('fas fa-plus ' + this.navigationSignClass)
            ).appendTo(boxElement);

            // add nested folders recursively
            let submenu = $('<ul>').addClass(this.navigationSubmenuClass);
            listItemElement.append(submenu);
            this.addFolders(submenu, folderObject.folders);
        }
        else folderElement.addClass('fas fa-folder');
    }

    folderIsClicked(event) {
        event.preventDefault();

        var linkObject = event.currentTarget;

        this.expandHideFolders(linkObject);

        // don't do anything if the same link is clicked
        if (this.currentActiveLink[0] === linkObject) return;

        // reverse URL to original one string before tree searching
        var linkString = this.files.reverseURL(linkObject.pathname);
        var folder = this.findFolder(linkString, this.serverData.home.folders);

        // add files on page and update folder size on page
        this.files.addToPage(folder);
        this.size.updateOnPage(folder);

        // update active link and add folder path for breadcrumbs menu
        this.updateActiveLink(linkObject);
        this.breadcrumbs.setFolderPath(this.serverData);
    }

    // expand folders from navigation or hide them
    expandHideFolders(link, redefineHeight = false) {
        var icon = $(link).find(`.${this.navigationIconClass}`);
        var expanded = icon.hasClass(this.folderPlusClass);
        var sign = $(link).find(`.${this.navigationSignClass}`);

        // return back maximum height content of submenu
        var submenu = $(link).next();
        var submenuExists = submenu.length;

        if (submenuExists) {
            if (expanded || redefineHeight) {
                this.showSubmenu(icon, sign, submenu, redefineHeight);
            }
            else {
                // hide submenu and hide all children nodes which are expanded when parent is closed
                this.hideSubmenu(icon, sign, submenu);
                this.hideAllChildren(submenu);
            }
        }

        // expand parent links up to the home link
        this.expandParents(link);
    }

    showSubmenu(icon, sign, submenu, redefineHeight) {
        // don't manipulate with classes twice or more
        if (!redefineHeight) {
            icon.removeClass(this.folderPlusClass);
            icon.addClass(this.folderMinusClass);
            sign.removeClass(this.signPlusClass);
            sign.addClass(this.signMinusClass);
        }

        // show submenu
        submenu.addClass(this.navigationSubmenuExpandedClass);
    }

    hideSubmenu(icon, sign, submenu) {
        icon.removeClass(this.folderMinusClass);
        icon.addClass(this.folderPlusClass);
        sign.removeClass(this.signMinusClass);
        sign.addClass(this.signPlusClass);

        // hide submenu
        submenu.removeClass(this.navigationSubmenuExpandedClass);
    }

    // expand parents links from navigation
    // when some nested link is expanded, then parent links must be expanded also
    expandParents(link) {
        var parentSubmenu = $(link).parent().parent();
        var isSubmenu = parentSubmenu.hasClass(this.navigationSubmenuClass);

        // only if parent submenu exists, then call again function for expanding folder
        // recursion will stop when there are no parent submenu folders
        if (isSubmenu) {
            let parentLinkForExpanding = parentSubmenu.prev();

            this.showParentLink(parentLinkForExpanding);
            this.expandHideFolders(parentLinkForExpanding, true);
        }
    }

    showParentLink(parentLink) {
        var icon = $(parentLink).find(`.${this.navigationIconClass}`);
        var sign = $(parentLink).find(`.${this.navigationSignClass}`);

        // show link by removing plus and adding minus
        icon.removeClass(this.folderPlusClass);
        icon.addClass(this.folderMinusClass);
        sign.removeClass(this.signPlusClass);
        sign.addClass(this.signMinusClass);
    }

    // when some folder is closed, then close all children folders inside it
    hideAllChildren(submenu) {
        var children = $(submenu).find(`.${this.navigationSubmenuClass}`);

        for (let i = 0; i < children.length; i++) {
            let link = $(children[i]).prev();
            let icon = link.find(`.${this.navigationIconClass}`);
            let sign = link.find(`.${this.navigationSignClass}`);
            let childrenSubmenu = link.next();

            this.hideSubmenu(icon, sign, childrenSubmenu);
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