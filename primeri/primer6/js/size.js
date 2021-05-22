// home size


export default class Size {

    constructor() {
        this.size = $('.home__size');
    }

    // update folder size on page
    updateOnPage(folder) {
        // get whole number of folders and files in tree structure including nested ones
        var numberOfFolders = parseInt(folder.contains.folders);
        var numberOfFiles = parseInt(folder.contains.files);

        // if size is zero, just set zero bytes
        var size = parseInt(folder.info.size.value) ? 
            folder.info.size.value + folder.info.size.unit : '0B';
        var sizeText = ``;

        // don't add zero folders or files
        if (numberOfFolders && numberOfFiles)
            sizeText += `${numberOfFolders} folders, ${numberOfFiles} files `;
        else if (numberOfFolders)
            sizeText += `${numberOfFolders} folders `;
        else if (numberOfFiles)
            sizeText += `${numberOfFiles} files `;

        sizeText += size;

        this.size.text(sizeText);
    }
}