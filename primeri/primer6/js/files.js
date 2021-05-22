// grid with files


import Preview from './preview.js';

export default class Files {

    constructor() {
        this.wrapper = $('.home__content');
        this.files = $('.files');

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
    }

    // add folders and files on page from cached folder object
    addToPage(folderCache) {
        this.removeFilesFromPage();

        this.files = $('<div>').addClass('files files--medium');

        // add folders / files from cache
        this.addFoldersFiles(folderCache.folders);
        this.addFoldersFiles(folderCache.files);

        this.wrapper.append(this.files);
    }

    removeFilesFromPage() {
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
        var link = $('<a>').addClass('files__link').attr('href', this.formatURL(cachedElement.info.path));
        var name = $('<div>').addClass('files__name').text(this.formatName(cachedElement.name));
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

    // create different icon depending on type of file / folder
    createIconHTML(type, cachedElement) {
        var icon;

        switch (type) {
            case this.types.folder.name:
                icon = $('<i>').addClass('fas fa-folder files__icon files__icon--folder');
                break;

            case this.types.file.name:
                icon = $('<i>').addClass('fas fa-file-alt files__icon files__icon--text');
                break;

            // for image, create image element with picture and other info
            case this.types.image.name:
                let imageInfo = cachedElement.name.toLowerCase() + ' image';

                icon = $('<img>').addClass('files__picture').attr('alt', imageInfo)
                    .attr('src', this.formatURL(cachedElement.info.path));
                break;

            case this.types.audio.name:
                icon = $('<i>').addClass('fas fa-file-audio files__icon files__icon--audio');
                break;

            case this.types.video.name:
                icon = $('<i>').addClass('fas fa-file-video files__icon files__icon--video');
                break;

            default: break;
        }

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

    // when folder is clicked, search from active navigation link to descendants to find folder link
    // it's much faster than to search entire tree structure
    folderIsClicked(linkURL, event) {
        event.preventDefault();

        var currentActiveNavigationLink = $('.navigation__link--active');
        var isHomepageLink = !currentActiveNavigationLink.length;
        var listItems;

        if (isHomepageLink) {
            let navigationList = $('.navigation__list');
            listItems = navigationList[0].children;
        }
        else {
            let submenu = currentActiveNavigationLink.next();
            listItems = submenu[0].children;
        }

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
        var textType = $(media).hasClass('files__icon--text');
        var audioType = $(media).hasClass('files__icon--audio');
        var videoType = $(media).hasClass('files__icon--video');
        var mediaElement;

        // look what kind of media is clicked (image, text, audio, video)
        if (imageType) mediaElement = this.createFilePreviewImage(media);
        else if (audioType) mediaElement = this.createFilePreviewAudio(link);
        else if (videoType) mediaElement = this.createFilePreviewVideo(link);

        // for text, wait for ajax request to finish before continue
        else if (textType) {
            await this.createFilePreviewText(link.href);
            mediaElement = this.textFromServer;
        }

        // now media element is ready, preview them on the screen
        this.filePreview.show(mediaElement);
    }

    createFilePreviewImage(media) {
        var imageSource = media.src;
        var imageInfo = media.alt;
        var image = $('<img>').addClass('preview__picture').attr('src', imageSource).attr('alt', imageInfo);

        return image;
    }

    createFilePreviewText(link) {
        // do ajax request to get text from server and return promise, 
        // because await is used for waiting for promise to resolve
        return $.ajax({
            url: link,
            method: 'GET'
        })
        .done(this.textIsFetched.bind(this));
    }

    textIsFetched(serverText) {
        var text = $('<div>').addClass('preview__text');
        text.text(serverText);

        // save text element
        this.textFromServer = text;
    }

    createFilePreviewAudio(link) {
        var audioSource = link.href;
        var audio = $('<audio>').addClass('preview__audio').attr('controls', true).attr('autoplay', true);
        var source = $('<source>').attr('src', audioSource).attr('type', 'audio/mpeg');

        audio.append(source);

        return audio;
    }

    createFilePreviewVideo(link) {
        var videoSource = link.href;
        var video = $('<video>').addClass('preview__video').attr('controls', true).attr('autoplay', true);
        var source = $('<source>').attr('src', videoSource).attr('type', 'video/mp4');

        video.append(source);
        
        return video;
    }
}