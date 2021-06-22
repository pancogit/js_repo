// home size


export default class Size {

    constructor(data) {
        this.serverData = data;
        this.size = $('.home__size');

        // when some file / folder is removed / added, then update size and number of elements
        this.currentFolderPath = 0;
        this.elementSize = 0;
        this.numberOfFilesFolders = 0;
        this.decrement = true;

        // bytes multiplication unit
        this.multiplyUnit = 1024;

        this.byteMeasure = {
            byte: 'B',
            kilobyte: 'KB',
            megabyte: 'MB',
            gigabyte: 'GB',
            terabyte: 'TB'
        }
    }

    // update folder size on page
    updateOnPage(folder) {
        // get whole number of folders and files in tree structure including nested ones
        var numberOfFolders = parseInt(folder.contains.folders);
        var numberOfFiles = parseInt(folder.contains.files);

        // if one file or folder is on the page, then don't add 's
        var folderString = numberOfFolders === 1 ? 'folder' : 'folders';
        var fileString = numberOfFiles === 1 ? 'file' : 'files';


        // if size is zero, just set zero bytes
        var size = parseInt(folder.info.size.value) ? 
            folder.info.size.value + folder.info.size.unit : '0B';
        var sizeText = ``;

        // don't add zero folders or files
        if (numberOfFolders && numberOfFiles)
            sizeText += `${numberOfFolders} ${folderString}, ${numberOfFiles} ${fileString} `;
        else if (numberOfFolders)
            sizeText += `${numberOfFolders} ${folderString} `;
        else if (numberOfFiles)
            sizeText += `${numberOfFiles} ${fileString} `;

        sizeText += size;

        this.size.text(sizeText);
    }

    // update size for parent folders in cached folder structure and on page also
    // also update number of files and folders on folder path
    // sizes and numbers can be incremented or decremented
    updateSizeFolders(currentFolderPath, elementSize, numberOfFilesFolders, currentFolderCached, decrement = true) {
        this.currentFolderPath = currentFolderPath;
        this.elementSize = elementSize;
        this.numberOfFilesFolders = numberOfFilesFolders;
        this.decrement = decrement;

        var onlyHomeFolder = currentFolderPath.length === 1;
        var currentFolderIndex = 1;  // home folder is at index 0, next begins with 1

        this.updateSizeHomeFolder();

        if (!onlyHomeFolder)
            // search through server data and update size and number of elements for folders
            this.updateSizeFoldersRecursively(this.serverData.home, currentFolderIndex);

        // update current folder size on page
        this.updateOnPage(currentFolderCached);
    }

    updateSizeHomeFolder() {
        this.updateNumberOfFilesFolders(this.serverData.home);
        this.updateSizeOfFilesFolders(this.serverData.home);
    }

    // update number of files / folders of server data
    updateNumberOfFilesFolders(folderCached) {
        var numberOfFiles, numberOfFolders;

        // decrement number of files and folders
        if (this.decrement) {
            numberOfFiles = parseInt(folderCached.contains.files) - parseInt(this.numberOfFilesFolders.files);
            numberOfFolders = parseInt(folderCached.contains.folders) - parseInt(this.numberOfFilesFolders.folders);
        }
        // increment number of files and folders
        else {
            numberOfFiles = parseInt(folderCached.contains.files) + parseInt(this.numberOfFilesFolders.files);
            numberOfFolders = parseInt(folderCached.contains.folders) + parseInt(this.numberOfFilesFolders.folders);
        }

        // update server data folder with new number of files and folders
        folderCached.contains.files = numberOfFiles.toString();
        folderCached.contains.folders = numberOfFolders.toString();
    }

    updateSizeFoldersRecursively(folderCached, currentFolderIndex) {

        for (let i = 0; i < folderCached.folders.length; i++) {
            // folder is found
            if (folderCached.folders[i].name === this.currentFolderPath[currentFolderIndex]) {
                currentFolderIndex++;

                this.updateNumberOfFilesFolders(folderCached.folders[i]);
                this.updateSizeOfFilesFolders(folderCached.folders[i]);

                // if all folders on given path are parsed, then don't search anymore
                if (currentFolderIndex >= this.currentFolderPath.length) return;

                this.updateSizeFoldersRecursively(folderCached.folders[i], currentFolderIndex);
            }
        }
    }

    // update size of files / folders of server data
    updateSizeOfFilesFolders(folderCached) {
        var folderSizeBytes = this.getSizeInBytes(folderCached.info.size);
        var elementSizeBytes = this.getSizeInBytes(this.elementSize);

        // substract / add folder size
        var folderSize = this.decrement ? 
            folderSizeBytes - elementSizeBytes : folderSizeBytes + elementSizeBytes;

        // convert B to KB / MB / GB / TB
        var folderSizeFactored = this.getFactoredSize(folderSize);

        // update unit and value for cached folder
        folderCached.info.size.unit = folderSizeFactored.unit;
        folderCached.info.size.value = folderSizeFactored.value;
    }

    getSizeInBytes(size) {
        var bytesFactor;

        // get multiplication factor for bytes
        switch (size.unit) {
            case this.byteMeasure.byte:
                bytesFactor = 1;
                break;

            case this.byteMeasure.kilobyte:
                bytesFactor = this.multiplyUnit;
                break;

            case this.byteMeasure.megabyte:
                bytesFactor = this.multiplyUnit * this.multiplyUnit;
                break;

            case this.byteMeasure.gigabyte:
                bytesFactor = this.multiplyUnit * this.multiplyUnit * this.multiplyUnit;
                break;

            case this.byteMeasure.terabyte:
                bytesFactor = this.multiplyUnit * this.multiplyUnit * this.multiplyUnit * this.multiplyUnit;
                break;
        }

        // size can be real number, don't round number, parse it as real number
        var numberOfBytes = parseFloat(size.value) * bytesFactor;

        return numberOfBytes;
    }

    // convert bytes to KB / MB / GB / TB in more compact form
    getFactoredSize(sizeInBytes) {
        // round bytes numbers to two decimal places
        var b = sizeInBytes.toFixed(2);
        var kb = (sizeInBytes / this.multiplyUnit).toFixed(2);
        var mb = (kb / this.multiplyUnit).toFixed(2);
        var gb = (mb / this.multiplyUnit).toFixed(2);
        var tb = (gb / this.multiplyUnit).toFixed(2);

        // look if bytes are in good range (less then equal to 1024) and keep
        // biggest bytes measure
        // also range must be greater or equal to 1 to not get very small numbers
        var bRange = (b >= 1) && (b < this.multiplyUnit);
        var kbRange = (kb >= 1) && (kb < this.multiplyUnit);
        var mbRange = (mb >= 1) && (mb < this.multiplyUnit);
        var gbRange = (gb >= 1) && (gb < this.multiplyUnit);
        var tbRange = (tb >= 1) && (tb < this.multiplyUnit);

        // look for highest bytes measure with good range and return them
        if (tbRange) return {
            unit: this.byteMeasure.terabyte,
            value: tb
        }
        else if (gbRange) return {
            unit: this.byteMeasure.gigabyte,
            value: gb
        }
        else if (mbRange) return {
            unit: this.byteMeasure.megabyte,
            value: mb
        }
        else if (kbRange) return {
            unit: this.byteMeasure.kilobyte,
            value: kb
        }
        else if (bRange) return {
            unit: this.byteMeasure.byte,
            value: b
        }

        // if none is true, then return zero bytes
        else return {
            unit: this.byteMeasure.byte,
            value: 0
        }
    }
}