// header for slideshow


export class Header {

    constructor(serverData) {
        this.data = serverData;
        this.numberOfSlides = this.data.length;
        this.content = document.getElementsByClassName('header__content').item(0);

        let buttons = this.content.getElementsByClassName('arrows__link');
        this.leftButton = buttons[0];
        this.rightButton = buttons[1];

        this.slideTimeSeconds = 4;
        this.imageNumber = 0;
        this.intervalID = 0;
        this.arrowLinkClass = 'arrows__link';
        this.arrowLinkActiveClass = 'arrows__link--active';

        // direction of automatically moving slides
        this.leftSide = "left";
        this.rightSide = "right";
        this.direction = this.rightSide;
    }

    addSlides() {
        this.startInteval();

        // add event listeners to buttons also
        this.leftButton.addEventListener('click', this.changeSlides.bind(this));
        this.rightButton.addEventListener('click', this.changeSlides.bind(this));
    }

    startInteval() {
        // call asynchronous function after specified time in intervals
        this.intervalID = setInterval(this.changeSlides.bind(this), this.slideTimeSeconds * 1000);
    }

    // change slides from the first to the last and then backwards, don't wrap around
    changeSlides(event) {
        var updateSlide = true;
        var lastSlide = this.imageNumber === this.numberOfSlides - 1;

        // buttons clicked
        if (event) updateSlide = this.moveSlidesByClick(event, lastSlide);

        // automatically moving slides
        else this.moveSlidesByDirection(lastSlide);

        if (updateSlide) {
            this.content.style.backgroundImage = 'url(' + this.data[this.imageNumber] + ')';
            this.updateActiveButtons();
        }
    }

    // changes slides with click and returns if slide should be changed
    moveSlidesByClick(event, lastSlide) {
        var changeSlide = true;

        event.preventDefault();

        var target = event.target;
        var isLink = target.classList.contains(this.arrowLinkClass);

        if (!isLink) target = target.parentElement;

        var leftButtonClicked = target === this.leftButton;
        var rightButtonClicked = target === this.rightButton;

        // stop current interval and start another
        clearInterval(this.intervalID);
        this.startInteval();

        // change slide only if buttons are still active
        if (leftButtonClicked) {
            if (this.imageNumber) this.imageNumber--;
            else changeSlide = false;
        }
        else if (rightButtonClicked) {
            if (!lastSlide) this.imageNumber++;
            else changeSlide = false;
        }

        return changeSlide;
    }

    // automatically moving slides with timer interval
    moveSlidesByDirection(lastSlide) {
        var moveToRight = this.direction === this.rightSide;
        var moveToLeft = this.direction === this.leftSide;

        if (moveToLeft) {
            if (this.imageNumber) this.imageNumber--;

            // change direction when first image is reached
            else {
                this.imageNumber++;
                this.direction = this.rightSide;
            }
        }
        else if (moveToRight) {
            if (!lastSlide) this.imageNumber++;

            // change direction when last image is reached
            else {
                this.imageNumber--;
                this.direction = this.leftSide;
            }
        }
    }

    updateActiveButtons() {
        let isLastSlide = this.imageNumber === this.numberOfSlides - 1;

        if (this.imageNumber) {
            this.leftButton.classList.add(this.arrowLinkActiveClass);
            this.rightButton.classList.add(this.arrowLinkActiveClass);
        }
        if (!this.imageNumber) this.leftButton.classList.remove(this.arrowLinkActiveClass);
        if (isLastSlide) this.rightButton.classList.remove(this.arrowLinkActiveClass);
    }
}