// file preview


export default class Preview {

    constructor() {
        this.previewMediaContainer = 0;
        this.previewContainer = this.createPreviewHTML();
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

        // save media container
        this.previewMediaContainer = media;

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

        // remove media element from DOM if exist
        if (element) $(element).remove();

        this.previewMediaContainer.append(mediaElement);

        // add preview container to the page
        $(document.body).append(this.previewContainer);
    }

    // remove preview container from page when preview is closed
    closePreview(event) {
        this.previewContainer.detach();
    }
}