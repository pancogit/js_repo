// slides


class Slides {

    constructor(images) {
        this.slides = document.getElementsByClassName('slides');

        this.imagesInfo = {
            imagesArray: images,
            numberOfImages: images.length,
            slides: []   // { slide: ..., currSlideIndex: ... }
        }

        for (let i = 0; i < this.slides.length; i++) {
            this.imagesInfo.slides.push({
                slide: this.slides[i],
                currSlideIndex: 0
            });
        }

        this.leftControlClass = 'slides__control--left';
        this.rightControlClass = 'slides__control--right';
        this.seconds = 3;
    }

    // add event listeners for slides on page
    addEventListeners() {
        for (let i = 0; i < this.slides.length; i++) {
            let left = this.slides[i].getElementsByClassName(this.leftControlClass).item(0);
            let right = this.slides[i].getElementsByClassName(this.rightControlClass).item(0);

            // send this pointer to event handler function via bind
            left.addEventListener('click', this.updateSlide.bind(this));
            right.addEventListener('click', this.updateSlide.bind(this));

            // set asynchronious timer interval and save interval id
            this.imagesInfo.slides[i].intervalID = setInterval(this.nextSlide.bind(this, null, i), this.seconds * 1000);
        }

        // update images initially
        this.updateInitialImages();
    }

    // update next slide via timer interval
    nextSlide(slideObj, index) {
        var slide;

        if (!slideObj) slide = this.findSlideByObject(this.slides[index]);
        else slide = slideObj;

        slide.currSlideIndex = (slide.currSlideIndex + 1) % this.imagesInfo.numberOfImages;
        slide.slide.style.backgroundImage = 'url(' + this.imagesInfo.imagesArray[slide.currSlideIndex] + ')';
    }

    // update current slide
    updateSlide(e) {
        e.preventDefault();

        var target = e.target;
        var isIcon = target.classList.contains('slides__icon');

        // if icon is clicked, then set target to link control
        if (isIcon) target = target.parentElement;

        // is left or right control clicked
        var isLeft = target.classList.contains(this.leftControlClass);
        var isRight = target.classList.contains(this.rightControlClass);

        var slide = target.parentElement.parentElement;
        var slideObj = this.findSlideByObject(slide);
        var numberOfImages = this.imagesInfo.numberOfImages;

        // stop timer interval when link control is clicked and set new timer interval
        // also save new interval id to be able to stop timer again with new id
        clearInterval(slideObj.intervalID);
        slideObj.intervalID = setInterval(this.nextSlide.bind(this, slideObj), this.seconds * 1000);

        // left control is clicked
        if (isLeft) {
            if (slideObj.currSlideIndex === 0) slideObj.currSlideIndex = numberOfImages - 1;
            else slideObj.currSlideIndex--;
        }
        // right control is clicked
        else if (isRight) {
            slideObj.currSlideIndex = (slideObj.currSlideIndex + 1) % numberOfImages;
        }

        slideObj.slide.style.backgroundImage = 'url(' + this.imagesInfo.imagesArray[slideObj.currSlideIndex] + ')';
    }

    // find slide by object
    findSlideByObject(slide) {
        for (let i = 0; i < this.imagesInfo.slides.length; i++) {
            if (this.imagesInfo.slides[i].slide === slide)
                return this.imagesInfo.slides[i];
        }

        return 0;
    }

    // update images initially
    updateInitialImages() {
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].style.backgroundImage = 'url(' + this.imagesInfo.imagesArray[0] + ')';
        }
    }
}