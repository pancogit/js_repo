// navigation


import Size from './size.js';
import Files from './files.js';

export default class Navigation {

    constructor(data, breadcrumbsObject, searchObject) {
        this.serverData = data;
        this.breadcrumbs = breadcrumbsObject;
        this.search = searchObject;

        this.navigationClass = 'navigation';
        this.navigationHideClass = 'navigation--hide';
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
        this.files = new Files(breadcrumbsObject, searchObject);
        this.header = 0;
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

        // sort files / folders on page in ascending order
        this.files.sortFolder(true);

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
        var navigation = $('<aside>').addClass(`${this.navigationClass} ${this.navigationHideClass} page__aside`);
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

        // sort files / folders on page in ascending order
        this.files.sortFolder(true);

        // update active link and add folder path for breadcrumbs menu
        this.updateActiveLink(linkObject);
        this.breadcrumbs.setFolderPath();

        // when any folder is clicked, then set default icon for sorting to skip 
        // sorting already sorted folder
        this.header.setDefaultSortIcon();

        // remove search results from page with click event fire
        this.search.removeSearchResults();
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

    // get info for file / folder with given name and location or path
    getFileFolderInfo(location, path, name) {
        var pathFormatted = path ? this.files.reverseURL(path) : path;
        var homePage = this.getHomepageFolderInfo(path, name);

        // if it's homepage return them, otherwise search for nested folders
        if (homePage) return homePage;
        else return this.getFileFolderInfoRecursive(this.serverData.home, location, pathFormatted, name);
    }

    // get info for homepage folder
    getHomepageFolderInfo(path, name) {
        var homeFolderCached = this.serverData.home;
        var homeName = homeFolderCached.name === name;
        var homePath = homeFolderCached.info.path === path;

        if (homeName && homePath) return {
            filesFolders: homeFolderCached,
            currentFolder: this.serverData
        }
    }

    getFileFolderInfoRecursive(folderCache, location, path, name) {
        var nameFound, locationFound, pathFound;
        var filefolderFound = false;

        // search files first
        for (let i = 0; i < folderCache.files.length; i++) {
            nameFound = folderCache.files[i].name === name;
            locationFound = folderCache.files[i].info.location === location;

            // file is found
            if (locationFound && nameFound)
                return {
                    filesFolders: folderCache.files[i],
                    currentFolder: folderCache
                }
        }

        // then search folders
        for (let i = 0; i < folderCache.folders.length; i++) {
            nameFound = folderCache.folders[i].name === name;
            locationFound = folderCache.folders[i].info.location === location;
            pathFound = folderCache.folders[i].info.path === path;

            if (filefolderFound) return filefolderFound;

            // folder is found
            if ((locationFound && nameFound) || (pathFound && nameFound))
                return {
                    filesFolders: folderCache.folders[i],
                    currentFolder: folderCache
                }

            // folder is not found, search further
            else filefolderFound = this.getFileFolderInfoRecursive(folderCache.folders[i], location, path, name);
        }

        if (filefolderFound) return filefolderFound;
    }

    // rename file or folder and return true if it's renamed, otherwise return false 
    // with error message if it's not renamed
    renameFileFolder(fileFolderCached, newFileFolderName) {
        var files = fileFolderCached.currentFolder.files;
        var folders = fileFolderCached.currentFolder.folders;
        var oldFileFolderName = fileFolderCached.filesFolders.name;
        var numberOfSameNames = 0;
        var nameOnlyWhitespaces = newFileFolderName.match(/^\s*$/);

        // don't rename if name contains only whitespaces
        if (nameOnlyWhitespaces) return {
            renamed: false,
            errorMessage: 'Name must not be empty'
        }

        // add extension to typed name
        var extension = Files.removeFileFolderExtension(oldFileFolderName).extension;
        newFileFolderName += extension;

        fileFolderCached.filesFolders.name = newFileFolderName;

        // search through files and folders in current folder and look if name exists
        for (let i = 0; i < files.length; i++)
            if (files[i].name === newFileFolderName) numberOfSameNames++;

        for (let i = 0; i < folders.length; i++)
            if (folders[i].name === newFileFolderName) numberOfSameNames++;

        var nameAlreadyExists = numberOfSameNames > 1;

        // file / folder already exists, return false
        if (nameAlreadyExists) {
            fileFolderCached.filesFolders.name = oldFileFolderName;

            return {
                renamed: false,
                errorMessage: 'Name already exists'
            }
        }
        // file / folder is renamed, return true
        else {
            this.updateRenamedFilesFolders(fileFolderCached, oldFileFolderName, newFileFolderName);

            return {
                renamed: true,
                errorMessage: ''
            }
        }
    }

    // update files / folders to navigation, files, breadcrumbs, search and other components
    updateRenamedFilesFolders(fileFolderCached, oldFileFolderName, newFileFolderName) {

        // update navigation text, files name, breadcrumbs menu and saved files before searching
        this.updateNavigationText(fileFolderCached.filesFolders);
        this.files.updateFilesName(oldFileFolderName, newFileFolderName);
        this.breadcrumbs.updateBreadcrumbsLinkName(oldFileFolderName, newFileFolderName);
        this.search.updateSavedFilesName(oldFileFolderName, newFileFolderName);

        // change location for all subfolders and subfiles when folder is renamed
        this.changeLocationSubFilesFolders(fileFolderCached.filesFolders, oldFileFolderName);

        // when folder is renamed, update locations for current opened folder on page
        this.files.updateOpenedFolderLocations(fileFolderCached, oldFileFolderName, newFileFolderName);
    }

    updateNavigationText(fileFolder) {
        var navigationText = $(fileFolder.link).find('.navigation__text');
        navigationText.text(fileFolder.name);
    }

    // when some folder is renamed, change location for for all subfiles and subfolders
    changeLocationSubFilesFolders(filesFoldersCached, oldName) {
        var isFolder = filesFoldersCached.info.type === 'File folder';
        var newName = filesFoldersCached.name;
        var changedLocation = this.changeFileFolderLocation(isFolder, filesFoldersCached, newName, oldName);

        this.changeLocationSubFilesFoldersNested(isFolder, filesFoldersCached, changedLocation);
    }

    // get file / folder location for first level of nesting
    changeFileFolderLocation(isFolder, filesFoldersCached, newName, oldName) {

        // change location only if folder is renamed, because files doesn't contains subfiles or subfolders
        if (isFolder) {
            let filesExists = filesFoldersCached.files.length;
            let foldersExists = filesFoldersCached.folders.length;
            let oldLocation, newLocation;
    
            if (filesExists) 
                oldLocation = filesFoldersCached.files[0].info.location;
            else if (foldersExists) 
                oldLocation = filesFoldersCached.folders[0].info.location;
    
            // if old location exists, then create new location
            if (oldLocation) {
                // remove last backslash from string and then find last occurense of backslash
                // to insert new string with new name
                let location = oldLocation.slice(0, oldLocation.length - 1);
                let replaceIndex = location.lastIndexOf('/');
    
                newLocation = oldLocation.slice(0, replaceIndex + 1) + newName + '/';
            }
    
            return newLocation;
        }
        else return 0;
    }

    changeLocationSubFilesFoldersNested(isFolder, filesFoldersCached, changedLocation) {

        if (isFolder) {
            // loop through files
            filesFoldersCached.files.forEach(function iterate(value, index, array) {
                this.insertNewLocation(value, changedLocation);
            }, this);

            // loop through folders
            filesFoldersCached.folders.forEach(function iterate(value, index, array) {
                this.insertNewLocation(value, changedLocation);

                // change location for nested folders
                this.changeLocationSubFilesFoldersNested(isFolder, value, changedLocation);
            }, this);
        }
    }

    // insert location part which is changed at the beginning of string and append remaining
    // unchanged part of the old location string
    insertNewLocation(value, changedLocation) {

        // remove backslashes from the beginning and from the end
        var changedLocationTrim = changedLocation.slice(1, changedLocation.length - 1);
        var oldLocationTrim = value.info.location.slice(1, value.info.location.length - 1);

        // tokenize strings first
        var changedLocationParts = changedLocationTrim.split('/');
        var oldLocationParts = oldLocationTrim.split('/');
        var fullLocation = '/';

        // insert first locations from changed part
        for (var i = 0; i < changedLocationParts.length; i++)
            fullLocation += changedLocationParts[i] + '/';

        // append remaining unchanged parts from old location
        for (; i < oldLocationParts.length; i++) 
            fullLocation += oldLocationParts[i] + '/';

        value.info.location = fullLocation;
    }

    // if folder is removed, then remove it from navigation also
    removeFolderFromNavigation(folderLink) {
        var navigationItem = $(folderLink).parent();
        var navigationSubmenu = navigationItem.parent();

        navigationItem.remove();

        var navigationSubmenuEmpty = !navigationSubmenu.find('.navigation__item').length;

        // if navigation submenu is empty after removing folder, then parent folder is empty
        // and plus / minus folder signs should be removed also
        if (navigationSubmenuEmpty) {
            this.removeFolderSignsFromNavigation(navigationSubmenu);
        }
    }

    // remove folder signs (plus, minus) for expanded submenu
    removeFolderSignsFromNavigation(submenu) {
        var navigationLink = submenu.prev();
        var icon = navigationLink.find(`.${this.navigationIconClass}`);
        var expand = navigationLink.find('.navigation__expand');

        submenu.remove();
        expand.remove();

        icon.removeClass(`${this.folderPlusClass} ${this.folderMinusClass}`).addClass('fa-folder');
    }
}