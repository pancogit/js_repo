// properties for files and folders


import Files from './files.js';

export default class Properties {

    constructor(navigationObject, filesObject) {
        this.navigationObject = navigationObject;
        this.files = filesObject;
        this.filesLinkClass = 'files__link';
        this.filesLinkSelectedClass = 'files__link--selected';
        this.filesNameClass = 'files__name';
        this.navigationLinkClass = 'navigation__link';
        this.navigationLinkSelectedClass = 'navigation__link--selected';
        this.navigationActiveLinkClass = 'navigation__link--active';
        this.navigationTextClass = 'navigation__text';
        this.homeContentClass = 'home__content';
        this.windowClass = 'properties__window';
        this.windowInputError = 'window__input--error';

        let propertiesObject = this.createPropertiesHTML();

        // all properties for files and folders
        this.properties = propertiesObject;

        // when properties overflows, then move element to the edge of overflow side
        // but not touch the overflow edge, just stay far from edge with given free space
        this.overflowFreeSpace = 10;

        // some properties for open space, not for files or folders
        this.smallProperties = this.createSmallPropertiesHTML(propertiesObject);

        this.navigation = $('.navigation');
        this.homeContent = $(`.${this.homeContentClass}`);

        // info window
        this.info = this.createInfoHTML();

        // rename windows for files and folders
        this.renameFile = this.createRenameHTML(true);
        this.renameFolder = this.createRenameHTML();
        this.renameMessageError = $('<div>').addClass('window__message window__message--error');

        // cached file or folder
        this.fileFolderCached = 0;
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
        this.addPropertiesListeners(open, info, rename);

        properties.append(windowProperty);
        windowProperty.append(open).append(cut).append(copy).append(paste)
            .append(deleteEntry).append(rename).append(info);

        return properties;
    }

    // add event listeners for individual properties
    // activate events for both left and right click
    addPropertiesListeners(open, info, rename) {
        open.on('click', this.openFileFolder.bind(this));
        open.on('contextmenu', this.openFileFolder.bind(this));

        info.on('click', this.infoFileFolder.bind(this));
        info.on('contextmenu', this.infoFileFolder.bind(this));

        rename.on('click', this.renameFileFolder.bind(this));
        rename.on('contextmenu', this.renameFileFolder.bind(this));
    }

    createEntryRowHTML(icon, propertyText, hasDivider = false, isEntryDisabled = false, isFlexDivider = false) {
        var entryRow = $('<div>').addClass('properties__entry row');
        var image = $('<span>').addClass('properties__image col-auto');
        var right = $('<div>').addClass('properties__right col');
        var text = $('<span>').addClass('properties__text').text(propertyText);

        if (isEntryDisabled) entryRow.addClass('properties__entry--disabled');
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

        return smallProperties;
    }

    // add entry for creating file or folder
    addCreateEntry(smallProperties) {
        var create = this.createEntryRowHTML(null, 'Create', true, false, true);
        var folderIcon = $('<i>').addClass('fas fa-folder-open properties__icon');
        var folder = this.createEntryRowHTML(folderIcon, 'Folder');
        var fileIcon = $('<i>').addClass('fas fa-file properties__icon');
        var file = this.createEntryRowHTML(fileIcon, 'File');

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
            button.on('click', this.tryRenameFileFolder.bind(this, true));
            $(window).on('keydown', this.closeRenameFile.bind(this));
        }
        else {
            close.on('click', this.closeRenameFolder.bind(this));
            button.on('click', this.tryRenameFileFolder.bind(this, false));
            $(window).on('keydown', this.closeRenameFolder.bind(this));
        }

        // when enter is pressed in input element, then click button
        input.on('keydown', this.renameInputIsChanged.bind(this, button));
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
        var coordinates = this.calculateCoordinates(fileFolderClicked ? this.properties :
            homeContentClicked ? this.smallProperties : 0,
            event);
        var x = coordinates.x, y = coordinates.y;
        var properties;

        if (fileFolderClicked) properties = this.properties;
        else if (homeContentClicked) properties = this.smallProperties;

        // x coordinate move property to the left, y coordinate move to the bottom
        properties.css('top', y);
        properties.css('left', x);

        // open file / folder properties or home content properties
        if (fileFolderClicked || homeContentClicked) $(document.body).append(properties);
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
        this.properties.detach();
        this.smallProperties.detach();

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

        // clear also rename file inputs and error classes
        this.renameFile.input.val('');
        this.renameFile.input.removeClass(this.windowInputError);
        this.renameFolder.input.val('');
        this.renameFolder.input.removeClass(this.windowInputError);

        // just remove element from page
        this.renameMessageError.detach();
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
    tryRenameFileFolder(isFile, event) {
        var newFileFolderName = isFile ? this.renameFile.input.val() : this.renameFolder.input.val();
        var renameIsPossible = this.navigationObject.renameFileFolder(this.fileFolderCached, newFileFolderName.trim());
        
        // close rename window and sort files / folders on page
        if (renameIsPossible.renamed) {
            if (isFile) this.closeRenameFile(event);
            else this.closeRenameFolder(event);

            // when file or folder is renamed, sorting must be done for all files and folders on page
            // sort files / folders on page in ascending order
            this.files.sortFolder(true);
        }
        // show error on rename window
        else {
            if (isFile) this.renameFile.input.addClass(this.windowInputError);
            else this.renameFolder.input.addClass(this.windowInputError);

            this.addRenameMessageError(renameIsPossible.errorMessage, isFile);
        }
    }

    addRenameMessageError(errorMessage, isFile) {
        var errorElement;
        var inputElement;
        var renameMessageErrorText = this.renameMessageError.text();

        // just change error message
        if (renameMessageErrorText !== errorMessage)
            this.renameMessageError.text(errorMessage);

        if (isFile) {
            errorElement = this.renameFile.input.next();
            inputElement = this.renameFile.input;
        }
        else {
            errorElement = this.renameFolder.input.next();
            inputElement = this.renameFolder.input;
        }

        // add error message for rename window to the page if doesn't exists
        if (errorElement[0] !== this.renameMessageError[0])
            inputElement.after(this.renameMessageError);
    }

    // when enter is pressed in input element, then click button
    renameInputIsChanged(button, event) {
        var enterIsPressed = event.key === 'Enter';

        if (enterIsPressed) button.click();
    }
}