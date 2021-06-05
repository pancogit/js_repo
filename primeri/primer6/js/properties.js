// properties for files and folders


export default class Properties {

    constructor() {
        this.filesLinkClass = 'files__link';
        this.filesLinkSelectedClass = 'files__link--selected';
        this.navigationLinkClass = 'navigation__link';
        this.navigationLinkSelectedClass = 'navigation__link--selected';
        this.homeContentClass = 'home__content';
        this.windowClass = 'properties__window';

        let propertiesObject = this.createPropertiesHTML();

        // all properties for files and folders
        this.properties = {
            object: propertiesObject,

            // when properties overflows, then move element to the edge of overflow side
            // but not touch the overflow edge, just stay far from edge with given free space
            overflowFreeSpace: 10
        }

        // some properties for open space, not for files or folders
        this.smallProperties = this.createSmallPropertiesHTML(propertiesObject);

        this.navigation = $('.navigation');
        this.homeContent = $(`.${this.homeContentClass}`);
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
        var create = this.createEntryRowHTML(null, 'Create', true, false, true);
        var folderIcon = $('<i>').addClass('fas fa-folder-open properties__icon');
        var folder = this.createEntryRowHTML(folderIcon, 'Folder');
        var fileIcon = $('<i>').addClass('fas fa-file properties__icon');
        var file = this.createEntryRowHTML(fileIcon, 'File');
        var deleteEntry = this.createEntryRowHTML(null, 'Delete');
        var rename = this.createEntryRowHTML(null, 'Rename', true);
        var info = this.createEntryRowHTML(null, 'Info');
        var subproperties = this.createSubpropertiesHTML(create, new Array(folder, file));

        properties.append(windowProperty);
        windowProperty.append(open).append(cut).append(copy).append(paste).append(subproperties)
            .append(deleteEntry).append(rename).append(info);

        return properties;
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
        var smallProperties = properties.clone();
        var directEntries = smallProperties.children().children();

        // remove entries which are not used for small properties
        directEntries[0].remove();
        directEntries[1].remove();
        directEntries[2].remove();
        directEntries[5].remove();
        directEntries[6].remove();

        return smallProperties;
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

        var coordinates = this.calculateCoordinates(event);
        var x = coordinates.x, y = coordinates.y;
        var properties;

        if (fileFolderClicked) properties = this.properties.object;
        else if (homeContentClicked) properties = this.smallProperties;

        // x coordinate move property to the left, y coordinate move to the bottom
        properties.css('top', y);
        properties.css('left', x);

        // open file / folder properties or home content properties
        if (fileFolderClicked || homeContentClicked) $(document.body).append(properties);
    }

    // calculate good coordinates for context menu
    calculateCoordinates(event) {
        var documentWidth = $(document).outerWidth();
        var documentHeight = $(document).outerHeight();
        var propertiesXCoordinate = event.clientX;
        var propertiesYCoordinate = event.clientY;
        var propertiesDimensions = this.getPropertiesDimensions(this.properties.object);

        // look if properties object is overflowing horizontal and vertical axis
        // overflow can happen on right or bottom side of document
        var propertiesWidthOverflow = (propertiesXCoordinate + propertiesDimensions.width) > documentWidth;
        var propertiesHeightOverflow = (propertiesYCoordinate + propertiesDimensions.height) > documentHeight;

        // if overflow occur on any axis, then move element to the overflowing edge (right for horizontal
        // overflow and bottom for vertical overflow)
        // substract also free space to not touch the overflow edge, just stay little far from edge
        if (propertiesWidthOverflow)
            propertiesXCoordinate = documentWidth - propertiesDimensions.width - this.properties.overflowFreeSpace;
        if (propertiesHeightOverflow)
            propertiesYCoordinate = documentHeight - propertiesDimensions.height - this.properties.overflowFreeSpace;

        // mouse event has current mouse coordinates
        return {
            x: propertiesXCoordinate,
            y: propertiesYCoordinate
        }
    }

    // close files / folders properties or home content properties
    closeContextMenu(event, deselectFile = true) {
        this.properties.object.detach();
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
}