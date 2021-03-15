// recipes


import { Borders } from './borders.js';

export class Recipes {

    constructor(serverData) {
        this.data = serverData;
        this.recipes = document.getElementsByClassName('recipes').item(0);
        this.recipesTextClass = 'recipes__text';
        this.recipesHeadingClass = 'recipes__heading';
        this.recipesCardClass = 'recipes__card';
        this.recipesCardActiveClass = 'recipes__card--active';
        this.recipesLinkClass = 'recipes__link';
        this.recipesPictureClass = 'recipes__picture';
        this.recipesImageLinkClass = 'recipes__image-link';
        this.recipesButtonClass = 'recipes__button';

        // create template for borders and use them for current active recipe
        // use the same borders for every active recipe, just detach them and
        // attach to DOM again when needed
        this.borders = new Borders().createBordersHTML();

        // remove static data from page
        this.removeRecipes();

        this.readMoreText = 'Read More';
        this.showLessText = 'Show Less';
        this.moreRecipesText = 'More Recipes';
        this.lessRecipesText = 'Less Recipes';
    }

    // remove recipes from page
    removeRecipes() {
        var cards = this.recipes.getElementsByClassName(this.recipesCardClass);
        var numberOfCards = cards.length;
        var button = this.recipes.lastElementChild;
        var isButton = button.classList.contains(this.recipesButtonClass);

        if (isButton) this.recipes.removeChild(button);

        for (let i = 0; i < numberOfCards; i++) this.recipes.removeChild(cards[0]);
    }

    // event handler when category on page is changed
    addRecipes(indexOfCategory, category, event) {
        event.preventDefault();

        var categoryClicked = this.getClickedCategory(event);
        var categoryIsActive = categoryClicked.classList.contains('categories__link--active');

        // update recipes only if it's not the same category clicked
        if (!categoryIsActive) {
            this.updateRecipes(indexOfCategory);

            // update active category
            category.updateActiveCategory(indexOfCategory);
        }
    }

    getClickedCategory(event) {
        var category = event.target;
        var isNotLink = !category.classList.contains('categories__link');

        // if it's not link, set category to parent element
        if (isNotLink) category = category.parentElement;

        return category;
    }

    updateRecipes(index, clearAll = true) {
        // show maximum two recipes at the beginning or all recipes later
        var category = this.data[index];
        var recipes = category.recipes;
        var numberOfRecipes = recipes.length;
        var numberOfAddedRecipes = numberOfRecipes < 2 ? numberOfRecipes : 2;

        // add two recipes
        if (clearAll) {
            // remove previous recipes from page
            this.removeRecipes();

            // add recipes to the page
            for (let i = 0; i < numberOfAddedRecipes; i++) {
                let recipe = this.createRecipesCardHTML(i, index, recipes[i]);
                this.recipes.append(recipe);
            }

            // add button to the page
            let button = this.createButtonHTML(category.link, index);
            this.recipes.append(button);
        }
        // add other recipes
        else {
            for (let i = numberOfAddedRecipes; i < numberOfRecipes; i++) {
                let recipe = this.createRecipesCardHTML(i, index, recipes[i]);
                this.recipes.append(recipe);
            }
        }
    }

    createRecipesCardHTML(indexOfRecipe, indexOfCategory, recipes) {
        var card = document.createElement('div');
        var picture = document.createElement('div');
        var content = document.createElement('div');
        var imageLink = document.createElement('a');
        var image = document.createElement('img');
        var heading = document.createElement('h3');
        var link = document.createElement('a');
        var ingredients = document.createElement('p');
        var text = document.createElement('p');
        var readMore = this.createButtonHTML(recipes.link, indexOfCategory, true);

        card.classList.add(this.recipesCardClass);

        picture.classList.add(this.recipesPictureClass);
        content.classList.add('recipes__content');
        imageLink.classList.add(this.recipesImageLinkClass);
        imageLink.href = recipes.link;
        image.classList.add('recipes__image');
        image.width = 250;
        image.height = 188;
        image.src = recipes.image.url;
        image.alt = recipes.image.text;
        heading.classList.add(this.recipesHeadingClass);
        link.classList.add(this.recipesLinkClass);
        link.href = recipes.link;
        link.textContent = recipes.heading;
        ingredients.classList.add('recipes__ingredients');
        ingredients.textContent = recipes.ingredients;
        text.classList.add(this.recipesTextClass);

        // get maximum 50 words from text
        text.textContent = this.selectFirst50Words(recipes.text, 50);

        // add event listener to the picture and link
        picture.addEventListener('click', this.updateActiveCard.bind(this));
        link.addEventListener('click', this.updateActiveCard.bind(this));

        card.append(picture);
        card.append(content);
        picture.append(imageLink);
        imageLink.append(image);
        heading.append(link);
        content.append(heading);
        content.append(ingredients);
        content.append(text);

        // add read more button for recipe only if text is not whole
        // for whole text, there is no need for read more button
        if (recipes.text !== text.textContent) content.append(readMore);

        // add active card modifier for first recipe and add borders also
        if (indexOfRecipe === 0) {
            card.classList.add(this.recipesCardActiveClass);
            imageLink.append(this.borders);
        }

        return card;
    }

    selectFirst50Words(fullText) {
        // match words with regular expression
        // match any characters including special, followed by zero or more whitespaces up to 50 times
        var firstWords = /([\w,.\!\?@#\-+;\/'\\\>\<:"|\[\]\{\}_=*\(\)&\^%\$]+\s*){1,50}/;
        var text = fullText.match(firstWords)[0];

        // append three dots only if not whole text is matched
        if (text !== fullText) text += '...';

        return text;
    }

    // create button including small variant
    createButtonHTML(linkString, categoryIndex, smallButton = false) {
        var readMore = document.createElement('div');
        var readMoreLink = document.createElement('a');

        readMore.classList.add(this.recipesButtonClass);
        readMoreLink.classList.add('recipes__more');
        readMoreLink.href = linkString;
        readMoreLink.textContent = smallButton ? this.readMoreText : this.moreRecipesText;

        // for small button also add event listener to expand whole text
        if (smallButton) {
            readMoreLink.classList.add('recipes__more--capitalize');

            // send this pointer and additional arguments via functional binding
            readMoreLink.addEventListener('click', this.expandOrCompressText.bind(this, categoryIndex));
        }
        // for normal button add event listener to show other recipes
        else readMoreLink.addEventListener('click', this.addOrRemoveNewRecipes.bind(this, categoryIndex));

        readMore.append(readMoreLink);

        return readMore;
    }

    // when read more is clicked, expand text for recipe or compress text when show less is clicked
    expandOrCompressText(categoryIndex, event) {
        var target = event.target;
        var isReadMore = target.textContent.includes(this.readMoreText);
        var isShowLess = target.textContent.includes(this.showLessText);
        var content = target.parentElement.parentElement;
        var text = content.getElementsByClassName(this.recipesTextClass).item(0);
        var headingText = content.getElementsByClassName(this.recipesHeadingClass).item(0).textContent;
        var fullText = this.findTextByCategoryIndex(categoryIndex, headingText);

        event.preventDefault();

        // expand text and swap button
        if (isReadMore) {
            text.textContent = fullText;
            target.textContent = this.showLessText;
        }
        // compress text and swap button
        else if (isShowLess) {
            text.textContent = this.selectFirst50Words(fullText, 10);
            target.textContent = this.readMoreText;
        }
    }

    // search for heading in category with given index
    findTextByCategoryIndex(categoryIndex, headingText) {
        var recipes = this.data[categoryIndex].recipes;

        for (let i = 0; i < recipes.length; i++) {
            if (recipes[i].heading === headingText)
                return recipes[i].text;
        }

        return '';
    }

    // add/remove recipes for main read more button
    addOrRemoveNewRecipes(categoryIndex, event) {
        event.preventDefault();

        var target = event.target;
        var targetWrapper = target.parentElement;
        var recipesContainer = targetWrapper.parentElement;
        var isMoreRecipes = target.textContent.includes(this.moreRecipesText);
        var isLessRecipes = target.textContent.includes(this.lessRecipesText);

        if (isMoreRecipes) {
            this.updateRecipes(categoryIndex, false);
            target.textContent = this.lessRecipesText;

            // move button to the end of recipe list
            recipesContainer.removeChild(targetWrapper);
            recipesContainer.append(targetWrapper);
        }
        else if (isLessRecipes) {
            this.removeNewRecipes(recipesContainer);
            target.textContent = this.moreRecipesText;
        }
    }

    removeNewRecipes(recipes) {
        var cards = recipes.getElementsByClassName(this.recipesCardClass);
        var numberOfCards = cards.length;

        // remove remaining recipes from page, leave just first two if they exists
        for (let i = 2; i < numberOfCards; i++) recipes.removeChild(cards[2]);

        this.restoreActiveCard(cards);
    }

    updateActiveCard(event) {
        event.preventDefault();

        var target = event.target;
        var card = this.getRecipeCard(target);
        var activeCard = card.classList.contains(this.recipesCardActiveClass);

        // update card only if it's not already active
        if (!activeCard) {
            let cards = this.recipes.getElementsByClassName(this.recipesCardClass);

            // remove previous active card before update new one
            for (let i = 0; i < cards.length; i++) cards[i].classList.remove(this.recipesCardActiveClass);

            card.classList.add(this.recipesCardActiveClass);

            let imageLink = card.getElementsByClassName(this.recipesImageLinkClass).item(0);

            // add borders to the new active card
            // it is not necessary to remove borders from DOM before adding new to the page
            // because it's the same DOM reference
            imageLink.append(this.borders);
        }
    }

    getRecipeCard(target) {
        while (!target.classList.contains(this.recipesCardClass)) {
            target = target.parentElement;
        }

        if (target.classList.contains(this.recipesCardClass)) return target;
        else return 0;
    }

    // set active card to first card if no one is active on page
    restoreActiveCard(cards) {
        var activeCardFound = false;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].classList.contains(this.recipesCardActiveClass))
                activeCardFound = true;
        }

        if (!activeCardFound) {
            cards[0].classList.add(this.recipesCardActiveClass);
            cards[0].getElementsByClassName(this.recipesImageLinkClass).item(0).append(this.borders);
        }
    }
}