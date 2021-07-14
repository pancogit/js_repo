// properties for files and folders


import Files from './files.js';

export default class Properties {

    constructor(navigationObject, filesObject, breadcrumbsObject) {
        this.navigationObject = navigationObject;
        this.files = filesObject;
        this.breadcrumbs = breadcrumbsObject;
        this.filesLinkClass = 'files__link';
        this.filesLinkSelectedClass = 'files__link--selected';
        this.filesLinkCutClass = 'files__link--cut';
        this.filesNameClass = 'files__name';
        this.navigationLinkClass = 'navigation__link';
        this.navigationLinkSelectedClass = 'navigation__link--selected';
        this.navigationActiveLinkClass = 'navigation__link--active';
        this.navigationLinkCutClass = 'navigation__link--cut';
        this.navigationTextClass = 'navigation__text';
        this.homeContentClass = 'home__content';
        this.windowClass = 'properties__window';
        this.windowInputError = 'window__input--error';
        this.propertiesEntryDisabledClass = 'properties__entry--disabled';

        let propertiesObject = this.createPropertiesHTML();

        // all properties for files and folders
        this.properties = propertiesObject;

        // when properties overflows, then move element to the edge of overflow side
        // but not touch the overflow edge, just stay far from edge with given free space
        this.overflowFreeSpace = 10;

        // some properties for open space, not for files or folders
        this.smallProperties = this.createSmallPropertiesHTML(propertiesObject.object);

        this.navigation = $('.navigation');
        this.homeContent = $(`.${this.homeContentClass}`);

        // info window
        this.info = this.createInfoHTML();

        // rename windows for files and folders
        this.renameFile = this.createRenameHTML(true);
        this.renameFolder = this.createRenameHTML();
        this.renameMessageError = $('<div>').addClass('window__message window__message--error');

        // delete prompt window for files and folders
        this.deleteWindow = this.createDeleteHTML();

        // window for folder copy error message
        this.folderErrorWindow = this.createFolderErrorWindowHTML();

        // window for creating files and folders
        this.createFile = this.createFileFolderHTML(true);
        this.createFolder = this.createFileFolderHTML(false);

        // cached file or folder
        this.fileFolderCached = 0;

        this.size = 0;

        // clipboard for files / folders copy / paste / cut
        this.clipboard = {

            // save selected file or folder on page or inside navigation
            selectedFileFolder: {
                selected: 0,

                // location and name for file / folder for home content files
                // if navigation folder is clicked don't set anything
                location: 0,
                name: 0
            },

            // save folder where paste is pressed
            pasteFolder: {
                selected: 0,

                // location and name for folder for home content files or from navigation
                location: 0,
                name: 0
            },

            // is file or folder cut or not
            cut: false,

            // when some file or folder is cut or copied, then clipboard is filled
            isFilled: false
        }
    }

    // hide properties before show on page to get dimension of properties
    // after that remove properties from page and return display to block
    // get properties width and height every time it's needed, because 
    // it can change if resolution gets higher
    getPropertiesDimensions(properties) {
        properties.hide();
        $(document.body).append(properties);

        var propertiesHeight = properties.outerHeight();
        var propertiesWidth = properties.outerWidth();

        properties.detach();
        properties.show();

        return {
            height: propertiesHeight,
            width: propertiesWidth
        }
    }

    createPropertiesHTML() {
        var properties = $('<div>').addClass('properties');
        var windowProperty = $('<div>').addClass(`${this.windowClass} container m-0`);
        var openIcon = $('<i>').addClass('fas fa-door-open properties__icon');
        var open = this.createEntryRowHTML(openIcon, 'Open', true);
        var cut = this.createEntryRowHTML(null, 'Cut');
        var copy = this.createEntryRowHTML(null, 'Copy');
        var paste = this.createEntryRowHTML(null, 'Paste', true, true);

        var deleteEntry = this.createEntryRowHTML(null, 'Delete');
        var rename = this.createEntryRowHTML(null, 'Rename', true);
        var info = this.createEntryRowHTML(null, 'Info');

        // add event listeners for individual properties
        this.addPropertiesListeners(open, info, rename, deleteEntry, copy, paste, cut);

        properties.append(windowProperty);
        windowProperty.append(open).append(cut).append(copy).append(paste)
            .append(deleteEntry).append(rename).append(info);

        // return properties object along with paste object
        return {
            object: properties,
            paste: paste
        }
    }

    // add event listeners for individual properties
    // activate events for both left and right click
    addPropertiesListeners(open, info, rename, deleteEntry, copy, paste, cut) {
        open.on('click', this.openFileFolder.bind(this));
        open.on('contextmenu', this.openFileFolder.bind(this));

        info.on('click', this.infoFileFolder.bind(this));
        info.on('contextmenu', this.infoFileFolder.bind(this));

        rename.on('click', this.renameFileFolder.bind(this));
        rename.on('contextmenu', this.renameFileFolder.bind(this));

        deleteEntry.on('click', this.deleteFileFolder.bind(this));
        deleteEntry.on('contextmenu', this.deleteFileFolder.bind(this));

        copy.on('click', this.copyFileFolder.bind(this));
        copy.on('contextmenu', this.copyFileFolder.bind(this));

        paste.on('click', this.pasteFileFolder.bind(this));
        paste.on('contextmenu', this.pasteFileFolder.bind(this));

        cut.on('click', this.cutFileFolder.bind(this));
        cut.on('contextmenu', this.cutFileFolder.bind(this));
    }

    createEntryRowHTML(icon, propertyText, hasDivider = false, isEntryDisabled = false, isFlexDivider = false) {
        var entryRow = $('<div>').addClass('properties__entry row');
        var image = $('<span>').addClass('properties__image col-auto');
        var right = $('<div>').addClass('properties__right col');
        var text = $('<span>').addClass('properties__text').text(propertyText);

        if (isEntryDisabled) entryRow.addClass(this.propertiesEntryDisabledClass);
        if (hasDivider) right.addClass('properties__right--divider');
        if (isFlexDivider) right.addClass('d-flex justify-content-between align-items-center');
        if (icon) image.append(icon);
        if (propertyText === 'Open') text.addClass('properties__text--open');

        entryRow.append(image).append(right);
        right.append(text);

        return entryRow;
    }

    // for given subproperty add properties from array
    createSubpropertiesHTML(subproperty, propertiesArray) {
        var window = $('<div>').addClass(this.windowClass);

        // add properties from array to the window
        propertiesArray.forEach(function addProperties(value, index, array) {
            window.append(value);
        }, this);

        this.addExpandIconForSubproperty(subproperty);

        subproperty.append(window);

        return subproperty;
    }

    addExpandIconForSubproperty(subproperty) {
        var right = subproperty.find('.properties__right');
        var expand = $('<span>').addClass('properties__expand');
        var expandIcon = $('<i>').addClass('fas fa-caret-right properties__more');

        expand.append(expandIcon);
        right.append(expand);
    }

    // create properties html with just paste, create and info when out of file or folder
    // is clicked with right click as context menu
    createSmallPropertiesHTML(properties) {

        // copy properties object first, because altering entries could affect original 
        // object because reference is used
        // also copy event listeners along the object (.clone(true))
        var smallProperties = properties.clone(true);
        var directEntries = smallProperties.children().children();

        // remove entries which are not used for small properties
        directEntries[0].remove();
        directEntries[1].remove();
        directEntries[2].remove();
        directEntries[4].remove();
        directEntries[5].remove();

        // add entry for create file / folder
        this.addCreateEntry(smallProperties);

        // save reference to the paste object
        var paste = this.getPasteObjectFromSmallProperties(smallProperties);

        // return properties object along with paste object
        return {
            object: smallProperties,
            paste: paste
        }
    }

    getPasteObjectFromSmallProperties(smallProperties) {
        var paste;
        var texts = smallProperties.find('.properties__text');

        for (var i = 0; i < texts.length; i++)
            // paste reference is found
            if ($(texts[i]).text() === 'Paste') break;

        paste = $(texts[i]).parent().parent();

        // return reference to paste object from small properties
        return paste;
    }

    // add entry for creating file or folder
    addCreateEntry(smallProperties) {
        var create = this.createEntryRowHTML(null, 'Create', true, false, true);
        var folderIcon = $('<i>').addClass('fas fa-folder-open properties__icon');
        var folder = this.createEntryRowHTML(folderIcon, 'Folder');
        var fileIcon = $('<i>').addClass('fas fa-file properties__icon');
        var file = this.createEntryRowHTML(fileIcon, 'File');

        // add event listeners for creating files and folders
        file.on('click', this.createFileFolder.bind(this));
        file.on('contextmenu', this.createFileFolder.bind(this));
        folder.on('click', this.createFileFolder.bind(this));
        folder.on('contextmenu', this.createFileFolder.bind(this));

        var subproperties = this.createSubpropertiesHTML(create, new Array(folder, file));
        var entries = smallProperties.find('.properties__entry');

        $(entries[0]).after(subproperties);
    }

    // create HTML for info and return them along with properties which can be changed and updated
    createInfoHTML() {
        var info = $('<div>').addClass('align-items-center d-flex justify-content-center window');
        var wrapper = $('<div>').addClass('window__wrapper flex-shrink-0');
        var header = $('<div>').addClass('window__header d-flex justify-content-between');
        var title = $('<span>').addClass('window__title').text('Text');
        var close = $('<i>').addClass('fas fa-times window__close d-flex justify-content-center align-items-center');
        var content = $('<div>').addClass('window__content');
        var container = $('<div>').addClass('window__container container');

        // create info properties with some examples
        var name = this.createInfoRowHTML('Name:', 'Mind-Bending Pictures of the Moon.txt');
        var fileType = this.createInfoRowHTML('Type of file:', 'Text Document (.txt)');
        var location = this.createInfoRowHTML('Location:', '/home/files/Mind-Bending Pictures of the Moon.txt', true);
        var size = this.createInfoRowHTML('Size:', '990B');
        var created = this.createInfoRowHTML('Created:', 'Wednesday, April 21, 2021, 20:52:25');

        var footer = $('<div>').addClass('window__footer d-flex justify-content-end');
        var button = $('<button>').addClass('window__button').text('OK');

        // add event listeners to close info window
        close.on('click', this.closeInfo.bind(this));
        button.on('click', this.closeInfo.bind(this));
        $(window).on('keydown', this.closeInfo.bind(this));

        info.append(wrapper);
        wrapper.append(header).append(content);
        header.append(title).append(close);
        content.append(container).append(footer);
        container.append(name.row).append(fileType.row).append(location.row).append(size.row).append(created.row);
        footer.append(button);

        return {
            object: info,
            properties: {
                name: name.info,
                fileType: fileType.info,
                location: location.info,
                size: size.info,
                created: created.info
            }
        }
    }

    // create HTML for one info entry and return that entry with info content
    createInfoRowHTML(propertyText, infoText, isLocationProperty = false) {
        var row = $('<div>').addClass('row mb-3');
        var property = $('<span>').addClass('window__property col-4').text(propertyText);
        var info = $('<span>').addClass('window__info col-8').text(infoText);

        // add one more class for location
        if (isLocationProperty) info.addClass('window__location');

        row.append(property).append(info);

        return {
            row: row,
            info: info
        }
    }

    // create HTML for renaming files or folders
    createRenameHTML(isFile) {
        var window = $('<div>').addClass('align-items-center d-flex justify-content-center window');
        var wrapper = $('<div>').addClass('window__wrapper flex-shrink-0');
        var header = $('<div>').addClass('window__header d-flex justify-content-between');
        var title = $('<span>').addClass('window__title');
        var close = $('<i>').addClass('fas fa-times window__close d-flex justify-content-center align-items-center');

        if (isFile) title.text('File Name');
        else title.text('Folder Name');

        var content = $('<div>').addClass('window__content');
        var input = $('<input>').addClass('window__input').attr('type', 'text').attr('maxlength', '100');
        var footer = $('<div>').addClass('window__footer d-flex justify-content-end');
        var button = $('<button>').addClass('window__button').text('OK');

        // add event listeners to close rename window
        this.addListenersForRenameWindow(close, button, input, isFile);

        window.append(wrapper);
        wrapper.append(header).append(content);
        header.append(title).append(close);
        content.append(input).append(footer);
        footer.append(button);

        // return window along with input
        return {
            window: window,
            input: input
        }
    }

    // add event listeners for rename file / folder window
    addListenersForRenameWindow(close, button, input, isFile) {

        if (isFile) {
            close.on('click', this.closeRenameFile.bind(this));
            button.on('click', this.tryRenameFileFolder.bind(this, true, 0));
            $(window).on('keydown', this.closeRenameFile.bind(this));
        }
        else {
            close.on('click', this.closeRenameFolder.bind(this));
            button.on('click', this.tryRenameFileFolder.bind(this, false, 0));
            $(window).on('keydown', this.closeRenameFolder.bind(this));
        }

        // when enter is pressed in input element, then click button
        input.on('keydown', this.renameInputIsChanged.bind(this, button));
    }

    createDeleteHTML() {
        var window = $('<div>').addClass('align-items-center d-flex justify-content-center window');
        var wrapper = $('<div>').addClass('window__wrapper flex-shrink-0');
        var header = $('<div>').addClass('window__header d-flex justify-content-between');
        var title = $('<span>').addClass('window__title');
        var close = $('<i>').addClass('fas fa-times window__close d-flex justify-content-center align-items-center');
        var content = $('<div>').addClass('window__content');
        var text = $('<div>').addClass('window__text').text('Are you sure you want to delete?');
        var footer = $('<div>').addClass('window__footer d-flex justify-content-end');
        var buttonYes = $('<button>').addClass('window__button').text('Yes');
        var buttonNo = $('<button>').addClass('window__button').text('No');

        this.addListenersDeleteWindow(close, buttonYes, buttonNo);

        window.append(wrapper);
        wrapper.append(header).append(content);
        header.append(title).append(close);
        content.append(text).append(footer);
        footer.append(buttonYes).append(buttonNo);

        return window;
    }

    // when destination folder is trying to copy inside source folder then it's error
    // create error window for that purpose
    createFolderErrorWindowHTML() {
        var errorWindow = this.createDeleteHTML();

        // it's very similar to delete window, just modify them
        var windowObj = $(errorWindow);
        var buttons = windowObj.find('.window__button');
        var yesButton = $(buttons[0]), noButton = $(buttons[1]);
    
        // remove 'yes' button from window and change text for another button
        // also remove event listeners from 'no' button
        yesButton.remove();
        noButton.text('Cancel');
        noButton.off();

        // remove event listeners from close button
        var close = windowObj.find('.window__close');
        close.off();

        // set new event listeners to close error window with close and cancel buttons
        close.on('click', this.closeDestinationError.bind(this));
        close.on('contextmenu', this.closeDestinationError.bind(this));
        noButton.on('click', this.closeDestinationError.bind(this));
        noButton.on('contextmenu', this.closeDestinationError.bind(this));

        // close error window on escape key also
        $(window).on('keydown', this.closeDestinationError.bind(this));
        
        // change text to error message
        windowObj.find('.window__text').text('The destination folder is a subfolder of the source folder.');

        return errorWindow;
    }

    addListenersDeleteWindow(close, buttonYes, buttonNo) {
        close.on('click', this.closeDeleteWindow.bind(this));
        close.on('contextmenu', this.closeDeleteWindow.bind(this));

        buttonNo.on('click', this.closeDeleteWindow.bind(this));
        buttonNo.on('contextmenu', this.closeDeleteWindow.bind(this));

        // also close delete window on escape key
        $(window).on('keydown', this.closeDeleteWindow.bind(this));

        buttonYes.on('click', this.removeFileFolder.bind(this));
        buttonYes.on('contextmenu', this.removeFileFolder.bind(this));
    }

    createFileFolderHTML(isFile) {
        var windowObject = this.createRenameHTML(isFile);
        var windowObjectQ = $(windowObject.window);
        var title = windowObjectQ.find('.window__title');
        var titleText = isFile ? 'Create File' : 'Create Folder';
        var close = windowObjectQ.find('.window__close');
        var input = windowObjectQ.find('.window__input');
        var button = windowObjectQ.find('.window__button');

        // remove old event listeners
        close.off();
        input.off();
        button.off();

        // add new event listeners
        close.on('click', this.closeCreateFileFolderWindow.bind(this, isFile));
        button.on('click', this.createNewFileFolder.bind(this, isFile));
        $(window).on('keydown', this.closeCreateFileFolderWindow.bind(this, isFile));

        // when enter is pressed in input element, then click button
        input.on('keydown', this.createFileFolderInputIsChanged.bind(this, button));

        title.text(titleText);

        return windowObject;
    }

    // right click open context menu, left click close them
    // also if window is resized or if escape key is pressed, close context menu
    addListeners() {
        $(window).on('contextmenu', this.openContextMenu.bind(this));
        $(window).on('click', this.closeContextMenu.bind(this));
        $(window).on('resize', this.closeContextMenu.bind(this));
        $(window).on('keydown', this.keyboardIsPressed.bind(this));
    }

    // correct coordinates for context menu should be calculated to not overflow document
    // context menu can be added to page without previous remove, because the same object reference is used
    openContextMenu(event) {

        // disable normal right click context menu to show properties menu
        event.preventDefault();

        var target = event.target;

        // if file or folder is clicked open context menu
        // also open small context menu if home content is clicked
        // for other cases don't open context menu
        var clicked = this.selectFileOrFolder(target);
        var fileFolderClicked = clicked === 1;
        var homeContentClicked = !clicked;
        var closeContext = clicked === -1;

        // close any previously opened context menu if exists
        this.closeContextMenu(event, false);

        // don't open context menu
        if (closeContext) return;

        // calculate coordinates for files / folders properties or for home content properties
        var coordinates = this.calculateCoordinates(fileFolderClicked ? this.properties.object :
            homeContentClicked ? this.smallProperties.object : 0,
            event);
        var x = coordinates.x, y = coordinates.y;
        var properties;

        if (fileFolderClicked) properties = this.properties.object;
        else if (homeContentClicked) properties = this.smallProperties.object;

        // x coordinate move property to the left, y coordinate move to the bottom
        properties.css('top', y);
        properties.css('left', x);

        // open file / folder properties or home content properties
        // also enable paste property if clipboard is filled, but don't enable for files
        // because it's not possible to paste into file
        // disable paste property if clipboard is not filled or file is selected on page
        if (fileFolderClicked || homeContentClicked) {
            if (this.clipboard.isFilled && this.isFolderSelectedOnPage())
                this.enablePasteProperties();
            else
                this.disablePasteProperties();

            $(document.body).append(properties);
        }
    }

    // return true if folder is selected on page
    isFolderSelectedOnPage() {
        var navigationLinkSelected = $(`.${this.navigationLinkSelectedClass}`);

        // if navigation link is selected, then it's folder for sure
        if (navigationLinkSelected.length) return true;

        var fileLinkSelected = $(`.${this.filesLinkSelectedClass}`);

        // if current folder on home content is clicked, then it's folder
        if (!fileLinkSelected.length) return true;

        var icon = $(fileLinkSelected[0].firstChild);
        var isFolderClicked = icon.hasClass('files__icon--folder');

        return isFolderClicked ? true : false;
    }

    // calculate good coordinates for context menu
    calculateCoordinates(properties, event) {
        var documentWidth = $(document).outerWidth();
        var documentHeight = $(document).outerHeight();
        var propertiesDimensions = this.getPropertiesDimensions(properties);

        // use coordinates relative to the whole document including possible scrolling bars
        var propertiesXCoordinate = event.pageX;
        var propertiesYCoordinate = event.pageY;

        // look if properties object is overflowing horizontal and vertical axis
        // overflow can happen on right or bottom side of document
        var propertiesWidthOverflow = (propertiesXCoordinate + propertiesDimensions.width) > documentWidth;
        var propertiesHeightOverflow = (propertiesYCoordinate + propertiesDimensions.height) > documentHeight;

        // if overflow occur on any axis, then move element to the overflowing edge (right for horizontal
        // overflow and bottom for vertical overflow)
        // substract also free space to not touch the overflow edge, just stay little far from edge
        if (propertiesWidthOverflow)
            propertiesXCoordinate = documentWidth - propertiesDimensions.width - this.overflowFreeSpace;
        if (propertiesHeightOverflow)
            propertiesYCoordinate = documentHeight - propertiesDimensions.height - this.overflowFreeSpace;

        // mouse event has current mouse coordinates
        return {
            x: propertiesXCoordinate,
            y: propertiesYCoordinate
        }
    }

    // close files / folders properties or home content properties
    closeContextMenu(event, deselectFile = true) {
        this.properties.object.detach();
        this.smallProperties.object.detach();

        // remove any selected class if exists from home content or from navigation
        if (deselectFile) {
            this.deselectFileOrFolder(this.filesLinkSelectedClass);
            this.deselectFileOrFolder(this.navigationLinkSelectedClass);
        }
    }

    // when escape is pressed, close properties
    keyboardIsPressed(event) {
        var escapeIsPressed = event.key === 'Escape';

        if (escapeIsPressed) this.closeContextMenu(event);
    }

    // try to select file or folder if it's clicked
    selectFileOrFolder(target) {

        // search for file link
        var fileLink = this.findFileLink(target, this.filesLinkClass);
        var currentFileElement = fileLink.elementFound;
        var fileLinkFound = fileLink.linkFound;

        var navigationLink, currentNavigationElement, navigationLinkFound;

        // if home content file or folder is not clicked, then look for navigation links
        if (!fileLinkFound) {
            navigationLink = this.findFileLink(target, this.navigationLinkClass);
            currentNavigationElement = navigationLink.elementFound;
            navigationLinkFound = navigationLink.linkFound;
        }

        var homeContent, homeContentElement, homeContentFound;

        // if navigation link is not clicked, then look for home content
        if (!navigationLinkFound) {
            homeContent = this.findFileLink(target, this.homeContentClass);
            homeContentElement = homeContent.elementFound;
            homeContentFound = homeContent.linkFound;
        }

        // remove any selected file or folder if exists
        this.deselectFileOrFolder(this.filesLinkSelectedClass);
        this.deselectFileOrFolder(this.navigationLinkSelectedClass);

        // if file or folder is clicked, then select that file or folder
        if (fileLinkFound)
            currentFileElement.addClass(this.filesLinkSelectedClass);
        else if (navigationLinkFound)
            currentNavigationElement.addClass(this.navigationLinkSelectedClass);

        // if file or folder is clicked return (1) or if home content is clicked (0)
        // if neither one is clicked, return -1
        return fileLinkFound || navigationLinkFound ? 1 : homeContentFound ? 0 : -1;
    }

    // find file link from clicked target element to the top of document and with given class
    // look for files or folders from home content or from navigation depending on given class
    findFileLink(target, fileLinkClass) {
        var currentElement = $(target);
        var fileLinkFound = false;

        while (currentElement.length) {
            fileLinkFound = currentElement.hasClass(fileLinkClass);

            if (fileLinkFound) break;

            currentElement = currentElement.parent();
        }

        return {
            linkFound: fileLinkFound,
            elementFound: currentElement
        }
    }

    // if any file or folder is selected, then deselect them
    deselectFileOrFolder(filesLinkClass) {
        var selectedElement = $(`.${filesLinkClass}`);

        if (selectedElement.length)
            selectedElement.removeClass(filesLinkClass);
    }

    // search for selected file or folder and fire click event on them
    openFileFolder(event) {
        var filesLinkSelected = $(`.${this.filesLinkSelectedClass}`);

        // file or folder from home content selected
        if (filesLinkSelected.length) filesLinkSelected.click();
        else {
            let navigationLinkSelected = $(`.${this.navigationLinkSelectedClass}`);

            // navigation folder is selected
            if (navigationLinkSelected.length) navigationLinkSelected.click();
        }
    }

    // open info window for selected file or folder
    infoFileFolder(event) {
        var info = this.getFileFolderCached();

        this.addInfoToPage(info);
    }

    // get file / folder cached info from navigation component
    getFileFolderCached() {
        var fileFolderPaths = this.getFileFolderPaths();
        var location = fileFolderPaths.location, path = fileFolderPaths.path, name = fileFolderPaths.name;
        var info = this.navigationObject.getFileFolderInfo(location, path, name);

        return info;
    }

    // for current clicked file / folder return name and location or path
    getFileFolderPaths() {
        var fileLinkSelected = $(`.${this.filesLinkSelectedClass}`);
        var navigationLinkSelected = $(`.${this.navigationLinkSelectedClass}`);
        var location, path, name;

        // file / folder from home content is selected
        if (fileLinkSelected.length) {
            location = fileLinkSelected[0].firstChild.dataset['location'];
            name = fileLinkSelected.find(`.${this.filesNameClass}`).attr('data-fullname');
        }
        // folder from navigation is selected
        else if (navigationLinkSelected.length) {
            path = navigationLinkSelected.attr('href');
            name = navigationLinkSelected.find(`.${this.navigationTextClass}`).text();
        }
        // current folder is selected from home content (no one file / folder is selected)
        // get active link from navigation and extract information from them
        // if none is selected, then it's home folder
        else {
            let currentFolder = this.getInfoCurrentFolder();
            path = currentFolder.path;
            name = currentFolder.name;
        }

        return {
            name: name,
            location: location,
            path: path
        }
    }

    // update info properties and add info object to the page
    addInfoToPage(info) {
        this.info.properties.name.text(info.filesFolders.name);
        this.info.properties.fileType.text(info.filesFolders.info.type);
        this.info.properties.location.text(info.filesFolders.info.location);
        this.info.properties.size.text(info.filesFolders.info.size.value + info.filesFolders.info.size.unit);
        this.info.properties.created.text(info.filesFolders.info.created);

        $(document.body).append(this.info.object);
    }

    // get info path and name for current folder
    getInfoCurrentFolder() {
        var navigationActiveLink = $(`.${this.navigationActiveLinkClass}`);
        var homePage = !navigationActiveLink.length;
        var path, name;

        // get home page path and name from server data
        if (homePage) {
            path = this.navigationObject.serverData.home.info.path;
            name = this.navigationObject.serverData.home.name;
        }
        else {
            path = navigationActiveLink.attr('href');
            name = navigationActiveLink.find(`.${this.navigationTextClass}`).text();
        }

        return {
            path: path,
            name: name
        }
    }

    closeInfo(event) {
        this.closePropertiesWindow(this.info.object, event);
    }

    closeRenameFile(event) {
        this.closePropertiesWindow(this.renameFile.window, event);
    }

    closeRenameFolder(event) {
        this.closePropertiesWindow(this.renameFolder.window, event);
    }

    // remove properties window from page
    // for keyboard, just close info if escape key is pressed
    closePropertiesWindow(windowObject, event) {
        var isEscapePressed = event.key === 'Escape';
        var keyboardEvent = event.type === 'keydown';

        if (keyboardEvent) {
            if (isEscapePressed) this.closeClearWindows(windowObject);
        }
        else this.closeClearWindows(windowObject);
    }

    // close and clear property windows
    closeClearWindows(windowObject) {
        windowObject.detach();

        // clear also rename / create file inputs and error classes
        this.clearFileInputsErrors();

        // just remove element from page
        this.renameMessageError.detach();
    }

    clearFileInputsErrors() {
        // clear rename file / folder inputs
        this.renameFile.input.val('');
        this.renameFile.input.removeClass(this.windowInputError);
        this.renameFolder.input.val('');
        this.renameFolder.input.removeClass(this.windowInputError);

        // clear create file / folder inputs
        this.createFile.input.val('');
        this.createFile.input.removeClass(this.windowInputError);
        this.createFolder.input.val('');
        this.createFolder.input.removeClass(this.windowInputError);
    }

    renameFileFolder(event) {
        var info = this.getFileFolderCached();
        var isFolder = info.filesFolders.info.type === 'File folder';

        // save cached file / folder for later use
        this.fileFolderCached = info;

        // if it's folder get full name because extension doesn't matter,
        // but if it's file then remove extension from name
        var currentFileFolderName = isFolder ? info.filesFolders.name :
            Files.removeFileFolderExtension(info.filesFolders.name).name;

        // add current file / folder name to the window input and 
        // add corrent rename window to the page depending on file / folder type
        if (isFolder) {
            this.renameFolder.input.val(currentFileFolderName);
            $(document.body).append(this.renameFolder.window);
        }
        else {
            this.renameFile.input.val(currentFileFolderName);
            $(document.body).append(this.renameFile.window);
        }
    }

    // when button for rename window is clicked, try to rename file or folder
    // if file or folder already exists in the current directory, then don't rename it 
    // and show error on rename window
    tryRenameFileFolder(isFile, windowObject, event) {
        var newFileFolderName;
        var windowObj;

        if (windowObject) windowObj = windowObject;
        else if (isFile) windowObj = this.renameFile;
        else windowObj = this.renameFolder;

        newFileFolderName = windowObj.input.val();

        var renameIsPossible = this.navigationObject.renameFileFolder(this.fileFolderCached, newFileFolderName.trim(), windowObject);

        if (renameIsPossible.renamed) {
            // close rename window and sort files / folders on page
            if (!windowObject) {
                if (isFile) this.closeRenameFile(event);
                else this.closeRenameFolder(event);
    
                // when file or folder is renamed, sorting must be done for all files and folders on page
                // sort files / folders on page in ascending order
                this.files.sortFolder(true);

                // when rename is finished, clear clipboard
                this.clipboard.isFilled = false;
            }

            // close create file / folder window
            else this.closeCreateFileFolderWindow(isFile, event);
        }
        // show error on rename window
        else {
            windowObj.input.addClass(this.windowInputError);
            this.addRenameMessageError(renameIsPossible.errorMessage, windowObj);
        }

        return renameIsPossible.renamed;
    }

    addRenameMessageError(errorMessage, windowObj) {
        var errorElement;
        var inputElement;
        var renameMessageErrorText = this.renameMessageError.text();

        // just change error message
        if (renameMessageErrorText !== errorMessage)
            this.renameMessageError.text(errorMessage);

        errorElement = windowObj.input.next();
        inputElement = windowObj.input;

        // add error message for rename window to the page if doesn't exists
        if (errorElement[0] !== this.renameMessageError[0])
            inputElement.after(this.renameMessageError);
    }

    // when enter is pressed in input element, then click button
    renameInputIsChanged(button, event) {
        var enterIsPressed = event.key === 'Enter';

        if (enterIsPressed) button.click();
    }

    deleteFileFolder(event) {
        var info = this.getFileFolderCached();

        // save cached file / folder for later use
        this.fileFolderCached = info;

        $(document.body).append(this.deleteWindow);
    }

    closeDeleteWindow(event) {
        this.closePropertiesWindow(this.deleteWindow, event);
    }

    // remove file or folder from system
    removeFileFolder(event) {
        this.closeDeleteWindow(event);

        this.removeFileFolderFromCache();
        this.files.removeFileFolderFromPage(this.fileFolderCached);

        var isFolder = this.fileFolderCached.filesFolders.info.type === 'File folder';
        var folderNavigationLink = this.fileFolderCached.filesFolders.link;

        if (isFolder) this.navigationObject.removeFolderFromNavigation(folderNavigationLink);
    }

    removeFileFolderFromCache() {
        var parentFolder = this.fileFolderCached.currentFolder;

        // search for file / folder in cached structure and remove them
        this.removeElementFromCache(parentFolder.files);
        this.removeElementFromCache(parentFolder.folders);
    }

    removeElementFromCache(element) {

        for (let i = 0; i < element.length; i++)
            if (element[i] === this.fileFolderCached.filesFolders) {
                // move all elements one position left to remove found element
                for (let j = i, k = i + 1; k < element.length; j++, k++)
                    element[j] = element[k];

                // remove last element which is duplicated
                delete element[element.length - 1];

                // when element is removed, decrement length of array
                element.length--;

                // decrement sizes for current folder path
                this.updateSizeParentFolders();

                return;
            }
    }

    // when some file or folder is removed or added, then size of current folder and all parent folders
    // up to the home folder must be updated, because size is smaller after deletion / addition
    updateSizeParentFolders(decrement = true, destinationFolderCached = 0) {
        var destinationFolder = destinationFolderCached ? 
            destinationFolderCached.filesFolders : this.fileFolderCached.currentFolder;
        var path = this.parseCurrentFolderPath(destinationFolder.info.location, destinationFolder.name);

        var elementSize = this.fileFolderCached.filesFolders.info.size;
        var isFolder = this.fileFolderCached.filesFolders.info.type === 'File folder';

        // if file is removed, then number of files is equal to one
        var numberOfFilesFolders = {
            files: "1",
            folders: "0"
        }

        // if folder is selected, then increment number of folders for that folder
        if (isFolder) {
            let fileFolderContains = this.fileFolderCached.filesFolders.contains;
            numberOfFilesFolders.files = fileFolderContains.files;
            numberOfFilesFolders.folders = (parseInt(fileFolderContains.folders) + 1).toString();
        }

        // update size for parent folders in cached folder structure and on page also
        this.size.updateSizeFolders(path, elementSize, numberOfFilesFolders, decrement);
    }

    // form strings for current folder path
    parseCurrentFolderPath(currentLocation, currentFolder) {
        var path = [];

        var trimmedLocation = currentLocation.slice(1, currentLocation.length - 1);
        var locations = trimmedLocation.split('/');

        for (let i = 0; i < locations.length; i++)
            if (locations[i] !== '') path.push(locations[i]);

        path.push(currentFolder);

        return path;
    }

    copyFileFolder(event) {
        this.saveClipboardFileFolder(false);
    }

    cutFileFolder(event) {
        this.saveClipboardFileFolder(true);
    }

    // save selected file or folder to the clipboard
    // if it's cut, then add corresponding cut class for link
    saveClipboardFileFolder(cut) {
        var selectedFileFolder = $(`.${this.filesLinkSelectedClass}`);
        var navigationSelectedFolder = $(`.${this.navigationLinkSelectedClass}`);

        // remove previous cut class if exists
        // if new element is cut or copy, then previous class is removed
        // new cut disable previous cut, but new copy disable previous cut / copy
        this.removeFileFolderCutClass();

        // save selected element on page or inside navigation for copying
        // also add cut class if file or folder is cut
        if (selectedFileFolder.length) {
            this.clipboard.selectedFileFolder.selected = selectedFileFolder;

            if (cut) this.clipboard.selectedFileFolder.selected.addClass(this.filesLinkCutClass);
        }
        else if (navigationSelectedFolder.length) {
            this.clipboard.selectedFileFolder.selected = navigationSelectedFolder;

            if (cut) this.clipboard.selectedFileFolder.selected.addClass(this.navigationLinkCutClass);
        }

        this.clipboard.cut = cut;

        // after cut or copy clipboard is filled
        // paste property can be enabled when context menu is opened
        this.clipboard.isFilled = true;
    }

    // save where file or folder is paste
    // paste is always done in folder
    saveClipboardPasteFolder() {
        var selectedFileFolder = $(`.${this.filesLinkSelectedClass}`);
        var navigationSelectedFolder = $(`.${this.navigationLinkSelectedClass}`);

        // save selected element on page where paste is pressed
        if (selectedFileFolder.length)
            this.clipboard.pasteFolder.selected = selectedFileFolder;
        else if (navigationSelectedFolder.length)
            this.clipboard.pasteFolder.selected = navigationSelectedFolder;

        // it's neither folder from home content or navigation, then current opened folder is paste location
        else this.clipboard.pasteFolder.selected = 0;
    }

    // remove previous added cut element class for file / folder
    removeFileFolderCutClass() {
        $(`.${this.filesLinkCutClass}`).removeClass(this.filesLinkCutClass);
        $(`.${this.navigationLinkCutClass}`).removeClass(this.navigationLinkCutClass);
    }

    // when some file or folder is cut or copied, then enable paste properties for 
    // main property window and for small property window
    enablePasteProperties() {
        this.properties.paste.removeClass(this.propertiesEntryDisabledClass);
        this.smallProperties.paste.removeClass(this.propertiesEntryDisabledClass);
    }

    disablePasteProperties() {
        this.properties.paste.addClass(this.propertiesEntryDisabledClass);
        this.smallProperties.paste.addClass(this.propertiesEntryDisabledClass);
    }

    pasteFileFolder(event) {
        var pasteIsDisabled = $(event.currentTarget).hasClass(this.propertiesEntryDisabledClass);

        // don't do anything if paste is disabled
        if (pasteIsDisabled) return;

        // in which folder it's paste
        this.saveClipboardPasteFolder();

        // first set location and name for copied / cut file / folder for home content files
        // also set location and name for paste folder, because paste is possible only to folder
        this.setClipboardLocationName();

        this.files.copyFileFolder(this.clipboard);

        // when paste is done for cut, then clipboard is not filled anymore
        // if it's copy, then another paste can be pressed, etc.
        if (this.clipboard.cut) {
            this.clipboard.isFilled = false;
            this.removeFileFolderCutClass();
        }

        this.clearClipboardLocationName();
    }

    clearClipboardLocationName() {
        this.clipboard.selectedFileFolder.name = 0;
        this.clipboard.selectedFileFolder.location = 0;
        this.clipboard.pasteFolder.name = 0;
        this.clipboard.pasteFolder.location = 0;
    }

    // if home content file / folder is copied / cut, then set location and name when paste is clicked
    // also set location and name for paste folder
    setClipboardLocationName(clipboardObject) {
        var object = clipboardObject ? clipboardObject : this.clipboard;

        this.setClipboardLocationNameByObject(object.selectedFileFolder);
        this.setClipboardLocationNameByObject(object.pasteFolder);
    }

    setClipboardLocationNameByObject(object) {
        // if current folder is paste folder, then set name of current folder
        if (!object.selected) {
            let currentFolder = $('.breadcrumbs__link').last();
            object.name = currentFolder.length ? currentFolder.text() : 'home';

            return;
        }

        var filesName = object.selected.find(`.${this.filesNameClass}`);
        var filesIcon = object.selected.find('.files__icon');

        if (!filesIcon.length) filesIcon = object.selected.find('.files__picture');

        var name = filesName.attr('data-fullname');
        var location = filesIcon.attr('data-location');

        // if name is not set, then navigation folder is copied / cut and get name from navigation link
        if (!name) name = object.selected.find('.navigation__text').text();

        object.name = name;
        object.location = location;
    }

    // when destination folder for copy is subfolder of source folder, then copy is not possible
    // when that happen, print error on page with window
    printDestinationError() {
        $(document.body).append(this.folderErrorWindow);
    }

    // close window for destination error
    closeDestinationError(event) {
        this.closePropertiesWindow(this.folderErrorWindow, event);
    }

    // open window for creating file or folder
    createFileFolder(event) {
        var isFile = $(event.currentTarget).find('.properties__text').text() === 'File';

        // add file / folder window to the page
        if (isFile) $(document.body).append(this.createFile.window);
        else $(document.body).append(this.createFolder.window);
    }

    closeCreateFileFolderWindow(isFile, event) {
        var windowObject = isFile ? this.createFile : this.createFolder;

        this.closePropertiesWindow(windowObject.window, event);
    }

    createNewFileFolder(isFile, event) {
        var windowObject = isFile ? this.createFile : this.createFolder;
        var name = windowObject.input.val();

        // use rename feature to see if file / folder name is correct
        var fileFolderCanBeCreated = this.createFileFolderCorrectName(name, isFile, windowObject, event);

        // use copy feature to create file / folder
        if (fileFolderCanBeCreated) this.createFileFolderCopy(isFile, name);
    }

    createFileFolderCorrectName(name, isFile, windowObject, event) {
        var fileFolder = this.fileFolderCached;

        this.fileFolderCached = {
            currentFolder: this.files.breadcrumbs.currentCachedFolder,
            filesFolders: {
                name: name,
                info: {
                    type: isFile ? '' : 'File folder'
                }
            }
        }

        var createIsPossible = this.tryRenameFileFolder(isFile, windowObject, event);
        this.fileFolderCached = fileFolder;

        return createIsPossible;
    }

    // when enter is pressed in input element for create file / folder, then click button
    createFileFolderInputIsChanged(button, event) {
        this.renameInputIsChanged(button, event);
    }

    // create file or folder using copy feature
    createFileFolderCopy(isFile, name) {
        var clipboardObject = this.createClipboardForCreate();
        this.setClipboardLocationName(clipboardObject);

        var currentLocation = this.breadcrumbs.getCurrentPath();

        // if it's file use path for empty file, otherwise it's folder and set folder path
        var currentPath = isFile ? 
            '/js_repo/primeri/primer6/js/data/Empty File.txt' : 
            `/js_repo/primeri/primer6/html${currentLocation.slice(5)}`;

        // create file or folder object
        var newFileFolder = isFile ? 
            this.createNewTextFile(name, currentPath, currentLocation) : 
            this.createNewFolder(name, currentPath, currentLocation);

        // set created time for new file or folder
        this.files.updateDestinationFilesFoldersCreatedTime(newFileFolder.filesFolders);

        this.files.copyFileFolder(clipboardObject, newFileFolder);
    }

    // create clipboard object for create file / folder
    createClipboardForCreate() {
        return {
            selectedFileFolder: {
                selected: 0,
                location: ' ',
                name: 0
            },

            pasteFolder: {
                selected: 0,
                location: 0,
                name: 0
            },

            // don't use clipboard for copy / cut
            cut: false,
            isFilled: false  
        }
    }

    // create simple textual file
    createNewTextFile(name, currentPath, currentLocation) {
        return {
            filesFolders: {
                name: `${name}.txt`,
                info: {
                    type: 'Text Document (.txt)',
                    path: currentPath,
                    location: currentLocation,
                    size: {
                        value: '0',
                        unit: 'B'
                    },
                    created: ''
                }
            }
        }
    }

    // create simple folder
    createNewFolder(name, currentPath, currentLocation) {
        return {
            filesFolders: {
                name: name,
                info: {
                    type: 'File folder',
                    path: `${currentPath}${name}/`,
                    location: currentLocation,
                    size: {
                        value: '0',
                        unit: 'B'
                    },
                    created: ''
                },
                contains: {
                    files: 0,
                    folders: 0
                },
                folders: [],
                files: [],
                link: {}
            }
        }
    }
}