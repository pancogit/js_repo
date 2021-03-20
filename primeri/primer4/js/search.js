// search


export class Search {

    constructor(serverData) {
        this.data = serverData;
        this.search = document.getElementsByClassName('search').item(0);
        this.input = this.search.getElementsByClassName('search__recipe').item(0);
        this.containerClass = 'search__container';
        this.resultClass = 'search__result';
        this.nameClass = 'search__name';
        this.showClass = 'show';
        this.container = this.createContainerHTML();
        this.noResults = this.createNoResultsHTML();
    }

    addEvents() {
        // remove static data and add new container
        this.removeStaticData();
        this.search.append(this.container);

        // add event listeners to the input
        this.input.addEventListener('keyup', this.searchForRecipes.bind(this));
        this.input.addEventListener('blur', this.hideContainer.bind(this));
        this.input.addEventListener('focus', this.showContainer.bind(this));

        // if input is empty with pressing X, then remove all results from page and hide container
        this.input.addEventListener('input', this.emptySearchBox.bind(this));
    }

    createContainerHTML() {
        var container = document.createElement('div');

        container.classList.add(this.containerClass);

        return container;
    }

    createNoResultsHTML() {
        var none = document.createElement('div');
        var text = document.createElement('h2');

        none.classList.add(this.resultClass);
        text.classList.add('search__no-results');
        text.textContent = 'No results for your search';
        none.append(text);

        return none;
    }

    removeStaticData() {
        var container = this.search.getElementsByClassName(this.containerClass).item(0);

        this.search.removeChild(container);
    }

    searchForRecipes(event) {
        // compare lower case letters
        var text = event.target.value.toLowerCase();
        var nothingFound = true;

        // if search box is filled with empty spaces, clear everything and add no results message
        if (this.onlySpacesSearchBox(text)) return;
        // look if search box is empty
        else if (this.emptySearchBox(event)) return;

        this.removeNonMatchedRecipes(text);

        // show container
        this.container.classList.add(this.showClass);

        // search for recipes and if found add them to the page
        nothingFound = this.findRecipes(text);

        // add no results message if there are no recipes
        if (nothingFound) this.container.append(this.noResults);

        // remove no results message if it's on page
        else {
            let isMessage = this.container.firstElementChild === this.noResults;

            if (isMessage) this.container.removeChild(this.noResults);
        }
    }

    // search for recipes with given text and if found add them to the page
    // return if no recipe is found
    findRecipes(text) {
        var recipe, recipeFound, nothingFound = true;

        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].recipes.length; j++) {
                recipe = this.data[i].recipes[j];
                recipeFound = recipe.heading.toLowerCase().includes(text);

                if (recipeFound) {
                    nothingFound = false;
                    this.addRecipe(recipe, this.data[i].name);
                }
            }
        }

        return nothingFound;
    }

    // for empty search box, remove recipes from search results and hide container
    // return 1 if search box is empty, otherwise 0
    emptySearchBox(event) {
        var text = event.target.value.toLowerCase();
        var emptySearch = this.isEmptyString(text);

        if (emptySearch) {
            this.removeRecipes();
            this.hideContainer();

            return 1;
        }

        return 0;
    }

    // if search box is filled with empty spaces, clear everything and add no results message
    // return 1 for success, otherwise 0
    onlySpacesSearchBox(text) {
        if (this.onlySpaces(text)) {
            this.removeRecipes();
            this.showContainer(true);
            this.container.append(this.noResults);

            return 1;
        }

        return 0;
    }

    // search using regular expression
    onlySpaces(text) {
        var spaces = text.match(/^\s+$/);

        return spaces;
    }

    // remove all recipes from page
    removeRecipes() {
        var results = this.container.getElementsByClassName(this.resultClass);
        var numberOfResults = results.length;

        for (let i = 0; i < numberOfResults; i++)
            this.container.removeChild(results[0]);
    }

    isEmptyString(text) {
        return !text.length && (text === '');
    }

    // add recipe to the page only if that recipe is not already there
    addRecipe(recipeObject, categoryName) {
        if (!this.isRecipeOnPage(recipeObject)) {
            let recipe = this.createSearchResultHTML(recipeObject, categoryName);

            this.container.append(recipe);
        }
    }

    isRecipeOnPage(recipeObject) {
        var results = this.container.getElementsByClassName(this.resultClass);
        var name, nameObject;

        for (let i = 0; i < results.length; i++) {
            nameObject = results[i].getElementsByClassName(this.nameClass);

            if (nameObject.length) name = nameObject.item(0).textContent.toLowerCase();
            else return;

            // recipe is found on page
            if (recipeObject.heading.toLowerCase() === name) return 1;

        }

        return 0;
    }

    createSearchResultHTML(recipeObject, categoryName) {
        var result = document.createElement('div');
        var link = document.createElement('a');
        var image = document.createElement('img');
        var text = document.createElement('div');
        var name = document.createElement('h2');
        var category = document.createElement('h3');

        result.classList.add(this.resultClass);
        link.classList.add('search__link');
        link.href = recipeObject.link;
        image.classList.add('search__image');
        image.src = recipeObject.image.url;
        image.alt = recipeObject.image.text;
        image.width = 50;
        image.height = 37;
        text.classList.add('search__text');
        name.classList.add(this.nameClass);
        name.textContent = recipeObject.heading;
        category.classList.add('search__category');
        category.textContent = categoryName;

        result.append(link);
        link.append(image);
        link.append(text);
        text.append(name);
        text.append(category);

        return result;
    }

    hideContainer(event) {
        this.container.classList.remove(this.showClass);
    }

    showContainer(justShow = false, event) {
        if (!justShow) {
            var target = event.target;

            if (this.onlySpaces(target.value)) return;
        }

        // if search box is empty, hide container, otherwise show
        var searchBoxEmpty = this.isEmptyString(this.input.value);

        if (searchBoxEmpty) this.container.classList.remove(this.showClass);
        else this.container.classList.add(this.showClass);
    }

    removeNonMatchedRecipes(text) {
        var results = this.container.getElementsByClassName(this.resultClass);
        var name, nameObj;
        var numberOfResults = results.length;

        for (let i = 0; i < numberOfResults;) {
            nameObj = results[i].getElementsByClassName(this.nameClass);

            if (!nameObj.length) return;

            name = nameObj.item(0).textContent.toLowerCase();

            // if search input is not part of search result, remove search result
            if (!name.includes(text)) {
                this.container.removeChild(results[i]);
                numberOfResults--;
            }
            else i++;
        }
    }
}