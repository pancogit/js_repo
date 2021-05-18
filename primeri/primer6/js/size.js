// home size


export default class Size {

    constructor() {
        this.size = $('.home__size');
    }

    // update folder size on page
    updateOnPage(folder) {
        var numberOfFolders = folder.folders.length;
        var numberOfFiles = folder.files.length;
        var size = folder.info.size.value + folder.info.size.unit;
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