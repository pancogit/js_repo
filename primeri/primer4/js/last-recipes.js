// last-recipes


import { Borders } from './borders.js';

export class LastRecipes {

    constructor(serverData) {
        this.data = serverData;
        this.maxNumberOfCards = 6;
        this.allRecipes = [];
        this.lastRecipesClass = 'last-recipes';
        this.contentClass = 'last-recipes__content';
        this.lastRecipes = document.getElementsByClassName(this.lastRecipesClass).item(0);

        // use the same reference for borders for active card
        this.borders = new Borders().createBordersHTML();
    }

    add() {
        this.sortByDate();
        this.removeContent();
        this.updateContent();
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
            case 'january': return 1;
            case 'february': return 2;
            case 'march': return 3;
            case 'april': return 4;
            case 'may': return 5;
            case 'jun': return 6;
            case 'july': return 7;
            case 'august': return 8;
            case 'september': return 9;
            case 'october': return 10;
            case 'november': return 11;
            case 'december': return 12;

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

        content.classList.add(this.contentClass);

        for (let i = 0; i < this.maxNumberOfCards; i++) {
            let card = this.createCardHTML(this.allRecipes[i], i === 0);

            content.append(card);
        }

        // add content to the page, insert at the beginning
        this.lastRecipes.prepend(content);
    }

    createCardHTML(recipes, isActiveCard) {
        var card = document.createElement('div');
        var picture = this.createPictureHTML(recipes, isActiveCard);
        var text = this.createTextHTML(recipes);

        card.classList.add('last-recipes__card');

        if (isActiveCard) card.classList.add('last-recipes__card--active');

        card.append(picture);
        card.append(text);

        return card;
    }

    createPictureHTML(recipes, isActiveCard) {
        var picture = document.createElement('div');
        var imageLink = document.createElement('a');
        var image = document.createElement('img');

        picture.classList.add('last-recipes__picture');
        imageLink.classList.add('last-recipes__image-link');
        imageLink.href = recipes.link;
        image.classList.add('last-recipes__image');
        image.src = recipes.image.url;
        image.alt = recipes.image.text;
        image.width = 150;

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
        link.classList.add('last-recipes__link');
        link.href = recipes.link;
        heading.classList.add('last-recipes__heading');
        heading.textContent = recipes.heading;

        text.append(date);
        text.append(link);
        link.append(heading);

        return text;
    }
}