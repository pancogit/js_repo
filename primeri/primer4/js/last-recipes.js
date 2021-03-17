// last-recipes


import { Borders } from './borders.js';

export class LastRecipes {

    constructor(serverData) {
        this.data = serverData;
        this.maxNumberOfCards = 6;
        this.allRecipes = [];
        this.lastRecipesClass = 'last-recipes';
        this.contentClass = 'last-recipes__content';
        this.arrowsLinkClass = 'arrows__link';
        this.arrowsLinkActiveClass = 'arrows__link--active';
        this.linkClass = 'last-recipes__link';
        this.headingClass = 'last-recipes__heading';
        this.imageLinkClass = 'last-recipes__image-link';
        this.imageClass = 'last-recipes__image';
        this.cardClass = 'last-recipes__card';
        this.cardActiveClass = 'last-recipes__card--active';
        this.lastRecipes = document.getElementsByClassName(this.lastRecipesClass).item(0);

        // number of last recipes slide, each slide contains 6 last recipes
        this.currentSlide = 0;
        this.numberOfSlides = 0;

        let buttons = this.lastRecipes.getElementsByClassName(this.arrowsLinkClass);
        this.leftButton = buttons[0];
        this.rightButton = buttons[1];

        // use the same reference for borders for active card
        this.borders = new Borders().createBordersHTML();
    }

    add() {
        // sort last recipes, remove static data and add last recipes to the page
        this.sortByDate();
        this.removeContent();
        this.updateContent();

        // get number of all slides
        this.numberOfSlides = this.allRecipes.length % 6 ? 
                              parseInt(this.allRecipes.length / 6 + 1) : 
                              parseInt(this.allRecipes.length / 6);

        // add event listeners for slides
        this.leftButton.addEventListener('click', this.changeSlide.bind(this));
        this.rightButton.addEventListener('click', this.changeSlide.bind(this));
    }

    sortByDate() {
        for (let i = 0; i < this.data.length; i++)
            for (let j = 0; j < this.data[i].recipes.length; j++)
                this.allRecipes.push(this.data[i].recipes[j]);

        // use array built-in method for sorting
        this.allRecipes.sort(this.compareFunction.bind(this));
    }

    // if dates are the same, then look for rating, if rating is the same, then first wins
    // returns positive value if first is less than second, negative value if first is 
    // greater than second or zero if first is equal to second (descending order)
    compareFunction(first, second) {
        var firstYear = parseInt(first.date.year);
        var firstMonth = this.getMonthNumber(first.date.month);
        var firstDay = parseInt(first.date.day);
        var firstRating = parseInt(first.rating);
        var secondYear = parseInt(second.date.year);
        var secondMonth = this.getMonthNumber(second.date.month);
        var secondDay = parseInt(second.date.day);
        var secondRating = parseInt(second.rating);

        var years = this.compareNumbers(firstYear, secondYear);

        // years equal, then compare months
        if (!years) {
            let months = this.compareNumbers(firstMonth, secondMonth);

            // months equal, then compare days
            if (!months) {
                let days = this.compareNumbers(firstDay, secondDay);

                // days equal, then compare ratings
                if (!days) return this.compareNumbers(firstRating, secondRating);

                else       return days;
            }
            else return months;
        }
        // years not equal, returns compare results
        else return years;
    }

    // returns number of month or in case of error returns -1
    getMonthNumber(month) {
        var monthLowerCase = month.toLowerCase();

        switch (monthLowerCase) {
            case 'january':   return 1;
            case 'february':  return 2;
            case 'march':     return 3;
            case 'april':     return 4;
            case 'may':       return 5;
            case 'jun':       return 6;
            case 'july':      return 7;
            case 'august':    return 8;
            case 'september': return 9;
            case 'october':   return 10;
            case 'november':  return 11;
            case 'december':  return 12;

            default: return -1;
        }
    }

    // compare two numbers and returns +1 if first is less then second, -1 if first
    // is greater than second or 0 if first is equal to second (descending order)
    compareNumbers(first, second) {
        if (first < second) return 1;
        if (first > second) return -1;
        else                return 0;
    }

    removeContent() {
        var content = this.lastRecipes.getElementsByClassName(this.contentClass).item(0);

        this.lastRecipes.removeChild(content);
    }

    // update maximum 6 cards per content
    updateContent() {
        var content = document.createElement('div');

        // get first and last index of card for current slide
        var firstCardIndex = this.currentSlide * this.maxNumberOfCards;
        var lastCardIndex = firstCardIndex + this.maxNumberOfCards;

        content.classList.add(this.contentClass);

        for (let i = firstCardIndex; i < lastCardIndex; i++) {
            let card = this.createCardHTML(this.allRecipes[i], i === firstCardIndex);

            content.append(card);
        }

        // add content to the page, insert at the beginning
        this.lastRecipes.prepend(content);
    }

    createCardHTML(recipes, isActiveCard) {
        var card = document.createElement('div');
        var picture = this.createPictureHTML(recipes, isActiveCard);
        var text = this.createTextHTML(recipes);

        card.classList.add(this.cardClass);

        if (isActiveCard) card.classList.add(this.cardActiveClass);

        card.append(picture);
        card.append(text);

        return card;
    }

    createPictureHTML(recipes, isActiveCard) {
        var picture = document.createElement('div');
        var imageLink = document.createElement('a');
        var image = document.createElement('img');

        picture.classList.add('last-recipes__picture');
        imageLink.classList.add(this.imageLinkClass);
        imageLink.href = recipes.link;
        image.classList.add(this.imageClass);
        image.src = recipes.image.url;
        image.alt = recipes.image.text;
        image.width = 150;

        imageLink.addEventListener('click', this.setActiveRecipe.bind(this));

        picture.append(imageLink);
        imageLink.append(image);

        if (isActiveCard) imageLink.append(this.borders);

        return picture;
    }

    createTextHTML(recipes) {
        var text = document.createElement('div');
        var date = document.createElement('span');
        var link = document.createElement('a');
        var heading = document.createElement('h3');

        text.classList.add('last-recipes__text');
        date.classList.add('last-recipes__date');
        date.textContent = recipes.date.month + ' ' + recipes.date.day + ', ' + recipes.date.year;
        link.classList.add(this.linkClass);
        link.href = recipes.link;
        heading.classList.add(this.headingClass);
        heading.textContent = recipes.heading;

        link.addEventListener('click', this.setActiveRecipe.bind(this));

        text.append(date);
        text.append(link);
        link.append(heading);

        return text;
    }

    // change slides when left or right button is clicked
    changeSlide(event) {
        event.preventDefault();

        var target = event.target;
        var isLink = target.classList.contains(this.arrowsLinkClass);

        if (!isLink) target = target.parentElement;

        var leftButtonClicked = target === this.leftButton;
        var rightButtonClicked = target === this.rightButton;
        var notFirstSlide = this.currentSlide > 0;
        var notLastSlide = this.currentSlide !== this.numberOfSlides - 1;
        var decrementSlide = leftButtonClicked && notFirstSlide;
        var incrementSlide = rightButtonClicked && notLastSlide;

        if (decrementSlide) this.currentSlide--;
        else if (incrementSlide) this.currentSlide++;

        // update current slide
        if (decrementSlide || incrementSlide) {
            this.removeContent();
            this.updateContent();
            this.updateActiveButton();
        }
    }

    // enable active and disabled inactive button
    updateActiveButton() {
        var firstSlide = this.currentSlide === 0;
        var lastSlide = this.currentSlide === this.numberOfSlides - 1;

        if (firstSlide) this.leftButton.classList.remove(this.arrowsLinkActiveClass);
        else            this.leftButton.classList.add(this.arrowsLinkActiveClass);
        
        if (lastSlide) this.rightButton.classList.remove(this.arrowsLinkActiveClass);
        else           this.rightButton.classList.add(this.arrowsLinkActiveClass);
    }

    setActiveRecipe(event) {
        event.preventDefault();

        var target = event.target;
        var recipeObject = this.isAlreadyActiveRecipe(target);
        var isAlreadyActive = recipeObject ? recipeObject.alreadyActive : false;

        // update active recipe if it's not the same clicked
        if (!isAlreadyActive) {
            this.lastRecipes.getElementsByClassName(this.cardActiveClass).item(0).classList.remove(this.cardActiveClass);

            // set active class for card and move borders inside image link
            recipeObject.recipe.classList.add(this.cardActiveClass);
            recipeObject.recipe.getElementsByClassName(this.imageLinkClass).item(0).append(this.borders);
        }
    }

    // return object with already active flag and reference to recipe or zero
    isAlreadyActiveRecipe(target) {
        // find card first
        while (!target.classList.contains(this.cardClass)) target = target.parentElement;

        var cardIsFound = target.classList.contains(this.cardClass);
        var cardIsActive = target.classList.contains(this.cardActiveClass);

        if (cardIsFound)
            return {
                alreadyActive: cardIsFound && cardIsActive,
                recipe: target
            }
        else return 0;
    }
}