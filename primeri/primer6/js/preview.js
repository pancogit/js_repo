// file preview

import Files from "./files.js";

export default class Preview {

    constructor() {
        this.previewMediaContainer = 0;
        this.previewArrowLeft = 0;
        this.previewArrowRight = 0;
        this.previewContainer = this.createPreviewHTML();
        this.files = 0;
    }

    createPreviewHTML() {
        var preview = $('<div>').addClass('d-flex flex-column preview');
        var top = $('<div>').addClass('preview__top');
        var close = $('<i>').addClass('fas fa-times preview__close');
        var content = $('<div>').addClass('preview__content flex-grow-1 d-flex align-items-center');
        var navigationLeft = $('<div>').addClass('preview__navigation');
        var arrowLeft = $('<i>').addClass('fas fa-chevron-left preview__arrow preview__arrow--left');
        var media = $('<div>').addClass('preview__media flex-grow-1 d-flex justify-content-center');
        var navigationRight = $('<div>').addClass('preview__navigation');
        var arrowRight = $('<i>').addClass('fas fa-chevron-right preview__arrow preview__arrow--right');

        // save media container and arrows
        this.previewMediaContainer = media;
        this.previewArrowLeft = arrowLeft;
        this.previewArrowRight = arrowRight;

        // add event listeners to arrows
        this.previewArrowLeft.on('click', this.arrowIsClicked.bind(this));
        this.previewArrowRight.on('click', this.arrowIsClicked.bind(this));

        // add event listener when preview is closed
        close.on('click', this.closePreview.bind(this));

        preview.append(top).append(content);
        top.append(close);
        navigationLeft.append(arrowLeft);
        navigationRight.append(arrowRight);
        content.append(navigationLeft).append(media).append(navigationRight);

        return preview;
    }

    show(mediaElement) {
        var element = this.previewMediaContainer[0].firstChild;
        var previewAlreadyOpened = $.contains(document.body, this.previewContainer[0]);

        // remove media element from DOM if exist
        if (element) $(element).remove();

        this.previewMediaContainer.append(mediaElement);

        // add preview container to the page if it's not already there
        if (!previewAlreadyOpened) $(document.body).append(this.previewContainer);
    }

    // remove preview container from page when preview is closed
    closePreview(event) {
        this.previewContainer.detach();
    }

    arrowIsClicked(event) {
        var arrow = event.currentTarget;
        var leftArrowClicked = arrow === this.previewArrowLeft[0];
        var rightArrowClicked = arrow === this.previewArrowRight[0];
        var mediaElement = this.previewMediaContainer[0].firstChild;
        var isImage = $(mediaElement).hasClass('preview__picture');
        var isText = $(mediaElement).hasClass('preview__text');
        var isAudio = $(mediaElement).hasClass('preview__audio');
        var isVideo = $(mediaElement).hasClass('preview__video');
        var fileLink;

        if (isImage) 
            fileLink = this.arrowIsClickedForFile(mediaElement.src, mediaElement, leftArrowClicked, 
                                                  rightArrowClicked, this.files.types.image);
        else if (isText) 
            fileLink = this.arrowIsClickedForFile(mediaElement, mediaElement, leftArrowClicked, 
                                                  rightArrowClicked, this.files.types.file);
        else if (isAudio)
            fileLink = this.arrowIsClickedForFile(mediaElement.firstChild.src, mediaElement.firstChild, 
                                                  leftArrowClicked, rightArrowClicked, this.files.types.audio);
        else if (isVideo) 
            fileLink = this.arrowIsClickedForFile(mediaElement.firstChild.src, mediaElement.firstChild, 
                                                  leftArrowClicked, rightArrowClicked, this.files.types.video);

        // fire click event on file link to change preview
        $(fileLink).click();
    }

    arrowIsClickedForFile(mediaElementSource, mediaElement, leftArrowClicked, rightArrowClicked, fileType) {
        var fileLink;
        var filePath = fileType === this.files.types.file ? 
            $(mediaElementSource).data('name') : Files.getURLPathname(mediaElementSource);
        var fileLocation = $(mediaElement).attr('data-location');

        // get previous or next file link
        if (leftArrowClicked)
            fileLink = this.files.getPreviousNextFileLink(fileType, filePath, fileLocation, 0);
        else if (rightArrowClicked)
            fileLink = this.files.getPreviousNextFileLink(fileType, filePath, fileLocation, 1);

        return fileLink;
    }
}