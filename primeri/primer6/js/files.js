// grid with files


import Preview from './preview.js';

export default class Files {

    constructor() {
        this.wrapper = $('.home__content');
        this.files = $('.files');
        this.filesNameClass = 'files__name';
        this.filesPictureClass = 'files__picture';
        this.filesIconTextClass = 'files__icon--text';
        this.filesIconAudioClass = 'files__icon--audio';
        this.filesIconVideoClass = 'files__icon--video';
        this.filesIconFolderClass = 'files__icon--folder';
        this.filesLinkClass = 'files__link';

        this.filesLargeClass = 'files--large';
        this.filesMediumClass = 'files--medium';
        this.filesSmallClass = 'files--small';

        this.dataLocationAttr = 'data-location';

        // by default, current view is medium for files
        // but it can be changed to large or small
        this.currentFilesView = this.filesMediumClass;

        this.types = {
            folder: {
                name: 'folder',
                type: 'File folder'
            },
            file: {
                name: 'file',
                type: 'Text Document (.txt)'
            },
            image: {
                name: 'image',
                types: {
                    jpg: 'JPEG image (.jpg)',
                    jpeg: 'JPEG image (.jpeg)',
                    png: 'PNG image (.png)'
                }
            },
            audio: {
                name: 'audio',
                type: 'MP3 Format Sound (.mp3)'
            },
            video: {
                name: 'video',
                type: 'MP4 Video (.mp4)'
            }
        }

        this.maxFileNameCharacters = 30;

        this.urlFormat = {
            whitespace: '%20',
            percentage: '%25'
        }

        // text fetched from server for clicked text file and set in HTML element
        this.textFromServer = 0;

        this.filePreview = new Preview();
        this.filePreview.files = this;
    }

    // add folders and files on page from cached folder object
    addToPage(folderCache) {
        this.removeFilesFromPage();

        // add class for current grid view for files
        this.files = $('<div>').addClass(`files ${this.currentFilesView}`);

        // add folders / files from cache
        this.addFoldersFiles(folderCache.folders);
        this.addFoldersFiles(folderCache.files);

        this.wrapper.append(this.files);
    }

    removeFilesFromPage() {
        this.files = $('.files');
        this.files.remove();
    }

    // add folders or files to the page
    addFoldersFiles(cachedFoldersFiles) {

        cachedFoldersFiles.forEach(function setFolders(value, index, array) {
            let box = this.createFolderFileHTML(this.getFolderFileCachedType(value), value);

            // add folder to the page
            this.files.append(box);
        }, this);

    }

    // create HTML for folder or file
    createFolderFileHTML(type, cachedElement) {
        var box = $('<div>').addClass('files__box');
        var link = $('<a>').addClass(this.filesLinkClass).attr('href', this.formatURL(cachedElement.info.path));
        var name = $('<div>').addClass(this.filesNameClass).text(this.formatName(cachedElement.name))
            .attr('data-fullname', cachedElement.name);
        var icon = this.createIconHTML(type, cachedElement);
        var isFolder = $(icon).hasClass('fa-folder');

        // add event listener for folders to emulate click on navigation links
        // send link for folder via function binding as additional argument
        if (isFolder) $(link).on('click', this.folderIsClicked.bind(this, link.attr('href')));

        // or add event listener for files to open them
        else $(link).on('click', this.fileIsClicked.bind(this));

        box.append(link);
        link.append(icon).append(name);

        return box;
    }

    // format folder / file name
    // if it's too long, then set tree dots at the end of name, otherwise return given name
    formatName(name) {
        var numberOfCharacters = name.length;

        return (numberOfCharacters > this.maxFileNameCharacters) ?
            name.slice(0, this.maxFileNameCharacters) + '...' : name;
    }

    // format url
    // replace whitespaces with url whitespace sign (%20) and replace 
    // percentages % with url percentage sign (%25)
    formatURL(url) {
        var formatPercentages = url.replaceAll('%', this.urlFormat.percentage);
        var withoutSpaces = formatPercentages.replaceAll(' ', this.urlFormat.whitespace);

        return withoutSpaces;
    }

    // reverse url format, replace url percentages and url whitespaces with real percentages and whitespaces
    reverseURL(url) {
        var withSpaces = url.replaceAll(this.urlFormat.whitespace, ' ');
        var withPercentages = withSpaces.replaceAll(this.urlFormat.percentage, '%');

        return withPercentages;
    }

    // get pathname of URL without origin and protocol
    static getURLPathname(url) {
        var urlObject = new URL(url);

        return urlObject.pathname;
    }

    // create different icon depending on type of file / folder
    createIconHTML(type, cachedElement) {
        var icon;

        switch (type) {
            case this.types.folder.name:
                icon = $('<i>').addClass(`fas fa-folder files__icon ${this.filesIconFolderClass}`);
                break;

            case this.types.file.name:
                icon = $('<i>').addClass(`fas fa-file-alt files__icon ${this.filesIconTextClass}`);
                break;

            // for image, create image element with picture and other info
            case this.types.image.name:
                let imageInfo = cachedElement.name.toLowerCase() + ' image';
                let imageInfoWithoutExtension = imageInfo.replaceAll('.jpg', '')
                    .replaceAll('.jpeg', '').replaceAll('.png', '');

                icon = $('<img>').addClass(this.filesPictureClass).attr('alt', imageInfoWithoutExtension)
                    .attr('src', this.formatURL(cachedElement.info.path));
                break;

            case this.types.audio.name:
                icon = $('<i>').addClass(`fas fa-file-audio files__icon ${this.filesIconAudioClass}`);
                break;

            case this.types.video.name:
                icon = $('<i>').addClass(`fas fa-file-video files__icon ${this.filesIconVideoClass}`);
                break;

            default: break;
        }

        // add location to the icon via custom data- attribute
        icon.attr(this.dataLocationAttr, cachedElement.info.location);

        return icon;
    }

    // get type of cached folder / file
    getFolderFileCachedType(cachedElement) {
        var type;

        switch (cachedElement.info.type) {
            case this.types.folder.type:
                type = this.types.folder.name;
                break;

            case this.types.file.type:
                type = this.types.file.name;
                break;

            case this.types.image.types.jpg:
            case this.types.image.types.jpeg:
            case this.types.image.types.png:
                type = this.types.image.name;
                break;

            case this.types.audio.type:
                type = this.types.audio.name;
                break;

            case this.types.video.type:
                type = this.types.video.name;
                break;

            default: break;
        }

        return type;
    }

    // when folder is clicked, search all navigation links to find folder link
    // it must be done because search results can search nested folders
    folderIsClicked(linkURL, event) {
        event.preventDefault();

        // get all navigation items from entire tree
        var listItems = $('.navigation__item');

        for (let i = 0; i < listItems.length; i++) {
            let folderLink = listItems[i].firstChild;
            let linkIsFound = folderLink.pathname === linkURL;

            // when link with clicked folder is found in navigation list, then fire click event
            // on navigation folder link to change folder structures, files, breadcrumbs
            // emulate click on navigation link
            if (linkIsFound) {
                $(folderLink).click();
                break;
            }
        }
    }

    // function must be asynchronous because of ajax call for text element
    async fileIsClicked(event) {
        event.preventDefault();

        var link = event.currentTarget;
        var media = link.firstChild;
        var imageType = media.tagName === 'IMG';
        var textType = $(media).hasClass(this.filesIconTextClass);
        var audioType = $(media).hasClass(this.filesIconAudioClass);
        var videoType = $(media).hasClass(this.filesIconVideoClass);
        var mediaElement;

        // look what kind of media is clicked (image, text, audio, video)
        if (imageType) mediaElement = this.createFilePreviewImage(media);
        else if (audioType) mediaElement = this.createFilePreviewAudio(link);
        else if (videoType) mediaElement = this.createFilePreviewVideo(link);

        // for text, wait for ajax request to finish before continue
        else if (textType) {
            await this.createFilePreviewText(link);
            mediaElement = this.textFromServer;
        }

        // now media element is ready, preview them on the screen
        this.filePreview.show(mediaElement);
    }

    createFilePreviewImage(media) {
        var imageSource = Files.getURLPathname(media.src);
        var imageInfo = media.alt;
        var image = $('<img>').addClass('preview__picture').attr('src', imageSource).attr('alt', imageInfo);
        var imageLocation = $(media).attr(this.dataLocationAttr);

        // add location to the image via custom data- attribute
        image.attr(this.dataLocationAttr, imageLocation);

        return image;
    }

    createFilePreviewText(link) {
        // do ajax request to get text from server and return promise, 
        // because await is used for waiting for promise to resolve
        return $.ajax({
            url: link.href,
            method: 'GET'
        })
            .done(this.textIsFetched.bind(this, link));
    }

    textIsFetched(link, serverText) {
        var text = $('<div>').addClass('preview__text');
        text.text(serverText);

        // set html data- attribute for text file name because that's how it's 
        // identified in current folder
        var filesName = $(link).find(`.${this.filesNameClass}`);
        text.attr('data-name', filesName.text());

        var filesIcon = $(link).find(`.${this.filesIconTextClass}`);
        var filesIconLocation = filesIcon.attr(this.dataLocationAttr);

        // add location to the text via custom data- attribute
        text.attr(this.dataLocationAttr, filesIconLocation);

        // save text element
        this.textFromServer = text;
    }

    createFilePreviewAudio(link) {
        var audioSource = Files.getURLPathname(link.href);
        var audio = $('<audio>').addClass('preview__audio').attr('controls', true).attr('autoplay', true);
        var source = $('<source>').attr('src', audioSource).attr('type', 'audio/mpeg');
        var audioIcon = link.firstChild;
        var sourceLocation = $(audioIcon).attr(this.dataLocationAttr);

        // add location to the audio via custom data- attribute
        source.attr(this.dataLocationAttr, sourceLocation);

        audio.append(source);

        return audio;
    }

    createFilePreviewVideo(link) {
        var videoSource = Files.getURLPathname(link.href);
        var video = $('<video>').addClass('preview__video').attr('controls', true).attr('autoplay', true);
        var source = $('<source>').attr('src', videoSource).attr('type', 'video/mp4');
        var videoIcon = link.firstChild;
        var sourceLocation = $(videoIcon).attr(this.dataLocationAttr);

        // add location to the video via custom data- attribute
        source.attr(this.dataLocationAttr, sourceLocation);

        video.append(source);

        return video;
    }

    // get previous or next file link from DOM
    getPreviousNextFileLink(fileType, fileInfo, fileLocation, previousNext) {
        var isImage = fileType === this.types.image;
        var isText = fileType === this.types.file;
        var isAudio = fileType === this.types.audio;
        var isVideo = fileType === this.types.video;
        var filesBoxes = this.getFilesFromDOM();
        var previousFileLink = previousNext === 0;
        var nextFileLink = previousNext === 1;
        var fileLink;

        if (isImage)
            fileLink = this.getPreviousNextFileLinkMedia(fileInfo, fileLocation, filesBoxes, 
                previousFileLink, nextFileLink, this.filesPictureClass);
        else if (isText)
            fileLink = this.getPreviousNextFileLinkMedia(fileInfo, fileLocation, filesBoxes, 
                previousFileLink, nextFileLink, this.filesIconTextClass);
        else if (isAudio)
            fileLink = this.getPreviousNextFileLinkMedia(fileInfo, fileLocation, filesBoxes, 
                previousFileLink, nextFileLink, this.filesIconAudioClass);
        else if (isVideo)
            fileLink = this.getPreviousNextFileLinkMedia(fileInfo, fileLocation, filesBoxes, 
                previousFileLink, nextFileLink, this.filesIconVideoClass);

        return fileLink;
    }

    // just get files from DOM, ignore folders
    getFilesFromDOM() {
        this.files = $('.files');

        var filesFolders = this.files[0].children;
        var files = [];

        for (let i = 0; i < filesFolders.length; i++) {
            let folder = $(filesFolders[i]).find(`.${this.filesIconFolderClass}`);
            let isFolder = folder.length;

            // push just files into files array, if it's folder don't do anything
            if (!isFolder) files.push(filesFolders[i]);
        }

        return files;
    }

    getPreviousNextFileLinkMedia(fileInfo, fileLocation, filesBoxes, previousFileLink, nextFileLink, mediaClass) {

        for (var i = 0; i < filesBoxes.length; i++) {
            let media = $(filesBoxes[i]).find(`.${mediaClass}`);

            if (media) {
                let mediaPath;
                let mediaLocation = media.attr(this.dataLocationAttr);
                let isText = mediaClass === this.filesIconTextClass;
                let isImage = mediaClass === this.filesPictureClass;

                // set media path for different type of media
                if (isText) mediaPath = media.next().text();
                else if (isImage) mediaPath = media.attr('src');
                else mediaPath = media.parent().attr('href');

                let sameFilePath = mediaPath === fileInfo;
                let sameFileLocation = mediaLocation === fileLocation;

                // media is found in DOM only if both location and path are the same
                if (sameFilePath && sameFileLocation) break;
            }
        }

        // return file link
        return this.getFileLink(previousFileLink, nextFileLink, i, filesBoxes);
    }

    getFileLink(previousFileLink, nextFileLink, i, filesBoxes) {

        // get file index of previous or next file
        // for previous file, if it's first file, then return last file, otherwise just decrement index
        // for next file, if it's last file, then return file file, otherwise just increment index
        var fileIndex;

        if (previousFileLink)
            fileIndex = i === 0 ? filesBoxes.length - 1 : i - 1;
        else if (nextFileLink)
            fileIndex = i === filesBoxes.length - 1 ? 0 : i + 1;

        var file = filesBoxes[fileIndex];

        // return file link
        return file.firstChild;
    }

    // change view for files in round
    changeFilesGridView() {
        this.files.removeClass(this.currentFilesView);

        switch (this.currentFilesView) {
            case this.filesLargeClass:
                this.files.addClass(this.filesMediumClass);
                this.currentFilesView = this.filesMediumClass;
                break;

            case this.filesMediumClass:
                this.files.addClass(this.filesSmallClass);
                this.currentFilesView = this.filesSmallClass;
                break;

            case this.filesSmallClass:
                this.files.addClass(this.filesLargeClass);
                this.currentFilesView = this.filesLargeClass;
                break;

            default: break;
        }
    }

    sortFolder(ascendingDescending) {
        var filesAndFolders = this.getFoldersFiles();
        var allFolders = filesAndFolders.folders;
        var allFiles = filesAndFolders.files;

        this.sortFilesFolders(allFolders, ascendingDescending);
        this.sortFilesFolders(allFiles, ascendingDescending);

        // remove files / folders from page
        this.files.empty();

        // add event listeners after sorting, because they are lost
        this.addEventListenersFilesFolders(allFolders, true);
        this.addEventListenersFilesFolders(allFiles);

        this.addSortedFilesFoldersToPage(allFolders, allFiles);
    }

    getFoldersFiles() {
        this.files = $('.files');

        var foldersArray = [];
        var filesArray = [];
        var filesFolders = this.files[0].children;

        // separate folders and files in two arrays
        for (let i = 0; i < filesFolders.length; i++) {
            let isFolder = $(filesFolders[i]).find(`.${this.filesIconFolderClass}`);

            if (isFolder.length) foldersArray.push(filesFolders[i]);
            else filesArray.push(filesFolders[i]);
        }

        return {
            folders: foldersArray,
            files: filesArray
        }
    }

    // sort files or folders in ascending or descending order
    sortFilesFolders(filesFolders, ascendingDescending) {

        for (let i = 0; i < filesFolders.length - 1; i++)
            for (let j = i + 1; j < filesFolders.length; j++) {
                // compare uppercase case letters, because if uppercase and lowercase letters
                // are mixed, then results are not correct
                let firstName = $(filesFolders[i]).find(`.${this.filesNameClass}`).text().toUpperCase();
                let secondName = $(filesFolders[j]).find(`.${this.filesNameClass}`).text().toUpperCase();

                let sortAscending = (firstName > secondName) && ascendingDescending;
                let sortDescending = (firstName < secondName) && !ascendingDescending;

                // if it's ascending or descending order, then swap elements
                if (sortAscending || sortDescending) this.swrapArrayElements(filesFolders, i, j);
            }
    }

    swrapArrayElements(array, i, j) {
        var temp = array[i];

        array[i] = array[j];
        array[j] = temp;
    }

    addEventListenersFilesFolders(filesFolders, isFolder = false) {

        filesFolders.forEach(function addFolders(value, index, array) {
            let link = $(value).find(`.${this.filesLinkClass}`);

            // add folder event listener
            if (isFolder)
                $(link).on('click', this.folderIsClicked.bind(this, link.attr('href')));

            // add file event listener
            else
                $(link).on('click', this.fileIsClicked.bind(this));
        }, this);
    }

    addSortedFilesFoldersToPage(allFolders, allFiles) {
        // add sorted folders to the page
        allFolders.forEach(function addFolders(value, index, array) {
            this.files.append(value);
        }, this);

        // add sorted files to the page
        allFiles.forEach(function addFolders(value, index, array) {
            this.files.append(value);
        }, this);
    }
}