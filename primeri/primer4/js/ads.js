// ads


import { Borders } from './borders.js';

export class Ads {

    constructor(serverData) {
        this.data = serverData;
        this.adsContainer = document.getElementsByClassName('ads').item(0);
        this.adsImageClass = 'ads__image';
        this.adsImageActiveClass = 'ads__image--active';
        this.adsImages = null;

        // use the same DOM reference when moving between active ads
        this.borders = new Borders().createBordersHTML(true);
    }

    // first remove static ads from page and create and add new with server data
    addAds() {
        this.removeStaticAds();

        for (let i = 0; i < this.data.length; i++) {
            let adsElement = this.createAdsHTML(i);

            // bind this pointer to event handler because it will be lost for handler in other way
            adsElement.addEventListener('click', this.updateActiveAds.bind(this));
            this.adsContainer.append(adsElement);
        }
    }

    removeStaticAds() {
        var images = this.adsContainer.getElementsByClassName(this.adsImageClass);
        var numberOfImages = images.length;

        for (let i = 0; i < numberOfImages; i++) this.adsContainer.removeChild(images[0]);
    }

    createAdsHTML(index) {
        var dataObject = this.data[index];
        var image = document.createElement('a');
        var headings = document.createElement('div');
        var heading = document.createElement('h2');
        var subheading = null;

        image.classList.add(this.adsImageClass);
        image.href = dataObject.link;
        image.style.backgroundImage = 'url(' + dataObject.backgroundImagePath + ')';
        headings.classList.add('ads__headings');
        heading.classList.add('ads__heading');
        heading.textContent = dataObject.heading;

        // if subheading exists, add them to the page
        if (dataObject.subheading) {
            subheading = document.createElement('h3');
            subheading.classList.add('ads__subheading');
            subheading.textContent = dataObject.subheading;
        }

        // let first ads be active
        if (index === 0) image.classList.add(this.adsImageActiveClass);

        image.append(headings);
        headings.append(heading);
        
        if (subheading) headings.append(subheading);

        // add borders for first active ads
        if (index === 0) image.append(this.borders);

        return image;
    }

    // update just ads which are not already active
    updateActiveAds(event) {
        var target = event.target;
        var isImage = target.classList.contains(this.adsImageClass);

        // if it's not image, change target reference to image
        if (!isImage) target = target.parentElement.parentElement;

        var isActive = target.classList.contains(this.adsImageActiveClass);

        event.preventDefault();

        if (!isActive) {
            // cache ads images only once
            if (!this.adsImages) 
                this.adsImages = this.adsContainer.getElementsByClassName(this.adsImageClass);
            
            // remove previous active image
            for (let i = 0; i < this.adsImages.length; i++) 
                this.adsImages[i].classList.remove(this.adsImageActiveClass);
            
            // add new active image by adding active class and detaching reference for borders
            target.classList.add(this.adsImageActiveClass);
            target.append(this.borders);
        }
    }
}