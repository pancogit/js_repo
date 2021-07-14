// search files and folders


import Matches from './matches.js';

export default class Search {

    constructor(data) {
        this.serverData = data;
        this.search = $('.search');
        this.textBox = this.search.find('.search__box');
        this.deleteBox = this.search.find('.search__delete');
        this.deleteIcon = this.deleteBox.find('.search__icon');
        this.homeContent = $('.home__content');
        this.homeSize = $('.home__size');

        this.activeClass = 'search--active';
        this.deleteHideClass = 'search__delete--hidden';
        this.filesClass = 'files';
        this.homeSizeHideClass = 'home__size--hide';
        this.filesNameClass = 'files__name';

        // search results
        this.matches = new Matches(this);
        this.breadcrumbs = 0;
        this.files = 0;

        // saved files, folders and home size
        this.savedFiles = 0;
        this.savedHomeSize = 0;
        this.currentFilesSaved = false;

        this.size = 0;
    }

    addListeners() {
        // add event listeners on text input
        this.textBox.on('input', this.textBoxTyping.bind(this));
        $(window).on('click', this.textBoxFocus.bind(this));

        // add event listener to clear text input when clicked
        this.deleteIcon.on('click', this.clearTextBox.bind(this));
    }

    // when it's clicked out of search component, then it's not active anymore
    // blur event cannot be used because text input has wrapper around them with more elements
    // and in that case borders can be inactive even if it's clicked inside search component
    // also use click event to set search active, because if it's clicked out of textbox, 
    // but still inside search component, then it will not be detected as focus event
    textBoxFocus(event) {
        var target = event.target;
        var searchFound = ($.contains(this.search[0], target)) || (this.search[0] === target);

        // if clicked element is not child of search element or search element itself, 
        // then remove active borders, otherwise set active borders
        if (!searchFound) this.search.removeClass(this.activeClass);
        else this.search.addClass(this.activeClass);
    }

    textBoxTyping(event) {
        // for search text don't show whitespaces at the beginning and at the end
        var textBoxContent = this.textBox.val();
        var textBoxContentTrimmed = textBoxContent.trim();
        var emptyTextBox = textBoxContent === '';

        // detect only spaces with regular expression
        var onlySpacesTextBox = textBoxContent.match(/^\s*$/);

        // show / hide delete box for text input
        if (emptyTextBox) this.deleteBox.addClass(this.deleteHideClass);
        else this.deleteBox.removeClass(this.deleteHideClass);

        // search for files and folders
        var filesFoldersFound = this.findFilesFolders(textBoxContentTrimmed);
        var numberOfFilesFoldersFound = filesFoldersFound.files.length + filesFoldersFound.folders.length;

        // save current folder before add search results to the page
        if (!this.currentFilesSaved) this.saveCurrentFolder();
        this.files.addToPage(filesFoldersFound);

        // remove or add search results to the page
        // also restore current folder
        if (onlySpacesTextBox) {
            this.matches.removeElementsFromPage();
            this.restoreCurrentFolder();
        }
        else this.matches.addElementsToPage(numberOfFilesFoldersFound, textBoxContentTrimmed);
    }

    // clear text input and hide delete icon
    clearTextBox(event) {
        this.textBox.val('');
        this.deleteBox.addClass(this.deleteHideClass);

        // also restore current folder if search is active
        if (this.currentFilesSaved) this.restoreCurrentFolder();

        // sort files / folders on page in ascending order
        this.files.sortFolder(true);

        // remove search results to the page
        this.matches.removeElementsFromPage();
    }

    // search through server data and try to find files/folders with given name 
    // or that contains given name
    findFilesFolders(name) {
        var files = [];
        var folders = [];
        var currentFolder = this.breadcrumbs.currentCachedFolder;

        // searching files/folders in current folder
        this.searchFilesFolders(currentFolder.files, name, files);
        this.searchFilesFolders(currentFolder.folders, name, folders);

        // search nested files/folders
        this.findNestedFilesFolders(files, folders, name, currentFolder.folders);

        return {
            files: files,
            folders: folders
        }
    }

    // search files/folders with recursion because of nested tree structure
    findNestedFilesFolders(files, folders, name, currentFolder) {

        // loop through nested folders
        currentFolder.forEach(function iterate(value, index, array) {

            // search files and then folders
            this.searchFilesFolders(value.files, name, files);
            this.searchFilesFolders(value.folders, name, folders);

            this.findNestedFilesFolders(files, folders, name, value.folders);
        }, this);
    }

    // search files or folders from cache with given name and save results to given array
    searchFilesFolders(filesFoldersCache, name, filesFolders) {

        filesFoldersCache.forEach(function iterate(value, index, array) {
            // convert both names to lowercase and then search because it's case sensitive
            let searchName = name.toLowerCase();
            let foundName = value.name.toLowerCase();

            // don't search name if it's empty string
            let found = searchName !== '' ? foundName.includes(searchName) : false;

            if (found) filesFolders.push(value);
        }, this);
    }

    // save current folder from DOM and home size
    // before removing file or folder from current folder from DOM remove file link cut class
    saveCurrentFolder() {
        this.savedFiles = $(`.${this.filesClass}`);

        // get all files boxes from DOM
        var files = this.savedFiles.children();
        var filesArray = [];
        var file;

        // remove cut class if exists because when search window is opened, 
        // any cut file or folder should be unmarked
        // detach files boxes from DOM and save each element into array
        for (let i = 0; i < files.length; i++) {
            file = $(files[i]);
            file.find('.files__link').removeClass('files__link--cut');
            file.detach();
            filesArray.push(files[i]);
        }

        // detach files wrapper from DOM and save array with files boxes
        this.savedFiles.detach();
        this.savedFiles = filesArray;

        this.savedHomeSize = this.homeSize.text();
        this.homeSize.text('');
        this.homeSize.addClass(this.homeSizeHideClass);

        this.currentFilesSaved = true;
    }

    // restore current folder to DOM and home size
    restoreCurrentFolder() {
        var searchFiles = this.homeContent.find(`.${this.filesClass}`);
        searchFiles.remove();

        // set home size with number of files / folders
        this.size.updateOnPage(this.breadcrumbs.currentCachedFolder);

        // create file wrapper with the current files class including current class modifier
        // and add saved files boxes to them and finally to the page
        var filesWrapperClass = searchFiles.attr('class');
        var filesWrapper = $('<div>').addClass(filesWrapperClass);
        filesWrapper.append(this.savedFiles)

        this.homeContent.append(filesWrapper);
        this.homeSize.removeClass(this.homeSizeHideClass);

        // files are restored now
        this.currentFilesSaved = false;
    }

    // remove search results from page with click event fire
    // search results must be already restored when navigation link is changed
    removeSearchResults() {
        this.homeSize.removeClass(this.homeSizeHideClass);
        this.currentFilesSaved = false;
        this.deleteIcon.click();
    }

    // when file or folder is renamed, update saved files before searching
    updateSavedFilesName(oldFileFolderName, newFileFolderName) {
        var filesNames = $(this.savedFiles).find(`.${this.filesNameClass}`);
        
        // search for saved files names and update correct one
        // also update data custom attribute
        for (let i = 0; i < filesNames.length; i++)
            if ($(filesNames[i]).text() === oldFileFolderName) {
                $(filesNames[i]).text(newFileFolderName);
                $(filesNames[i]).attr('data-fullname', newFileFolderName);
                break;
            }
    }

    // if some file or folder is removed from search results, then search results can change
    // for that situation, search results must be updated
    // also remove deleted file or folder from saved files before searching was done
    updateSearchResults(fileFolderCached) {
        this.textBoxTyping();
        this.removeSavedFile(fileFolderCached);
    }

    // when some file or folder is removed from search results, then when search results
    // are closed, files are restored for current folder and then removed file or folder
    // can be still on page
    // but in some situations it could not be the problem if file or folder is nested inside current
    // folder and in that situation nothing is done
    removeSavedFile(fileFolderCached) {
        var filesNames = $(this.savedFiles).find(`.${this.filesNameClass}`);
        var currentFullname;
        
        // search for saved files names and update correct one
        // also update data custom attribute
        for (let i = 0; i < filesNames.length; i++) {
            currentFullname = $(filesNames[i]).attr('data-fullname');

            // file or folder is found, remove them from saved cache
            if (currentFullname === fileFolderCached.name) {
                
                // move all elements to the left to remove found element from cache
                for (let j = i, k = i + 1; k < filesNames.length; j++, k++)
                    this.savedFiles[j] = this.savedFiles[k];

                // decrement length of cached array to remove last element from them, it's duplicate
                this.savedFiles.length--;

                break;
            }
        }
    }
}