// categories


export class Categories {

    constructor(serverData, recipesObject) {
        this.data = serverData;
        this.homeCategories = document.getElementsByClassName('home__categories').item(0);
        this.categories = null;
        this.categoriesLinks = null;
        this.recipes = recipesObject;
        this.categoriesLinkActiveClass = 'categories__link--active';
        this.categoriesLinkClass = 'categories__link';
    }

    addCategories() {
        this.removeCategories();

        // create and add categories to the page
        this.categories = this.createHTML();
        this.homeCategories.append(this.categories);

        this.categoriesLinks = this.categories.getElementsByClassName(this.categoriesLinkClass);
    }

    // remove static data
    removeCategories() {
        var categories = this.homeCategories.getElementsByClassName('categories').item(0);

        this.homeCategories.removeChild(categories);
    }

    // create and return HTML for categories
    createHTML() {
        var categories = document.createElement('ul');

        categories.classList.add('categories');

        // fill with data from server
        for (let i = 0; i < this.data.length; i++) {
            let item = document.createElement('li');
            let link = document.createElement('a');
            let arrow = document.createElement('i');
            let name = document.createElement('span');
            let count = document.createElement('span');

            item.classList.add('categories__item');
            link.href = this.data[i].link;
            link.classList.add(this.categoriesLinkClass);

            // add event listener for link to recipes
            // bind recipes object as this pointer for recipes and additional arguments
            // (index of clicked category, category object) to event handler
            link.addEventListener('click', this.recipes.addRecipes.bind(this.recipes, i, this));

            // set active link for first link after recipes are updated on page
            // because when some link is active, then it's not updated twice on page
            // emulate click event for first default active link to update recipes on page
            if (i === 0) {
                link.click();
                link.classList.add(this.categoriesLinkActiveClass);
            }

            arrow.classList.add('fas', 'fa-chevron-right', 'categories__arrow');
            name.classList.add('categories__name');
            name.textContent = this.data[i].name;
            count.classList.add('categories__count');
            count.textContent = '(' + this.data[i].recipes.length + ')';

            item.append(link);
            link.append(arrow);
            link.append(name);
            link.append(count);
            categories.append(item);
        }

        return categories;
    }

    updateActiveCategory(index) {
        if (this.categoriesLinks) {
            // remove previous active class
            let currentActiveCategory = 
                this.categories.getElementsByClassName(this.categoriesLinkActiveClass).item(0);

            currentActiveCategory.classList.remove(this.categoriesLinkActiveClass);

            // add new active class
            this.categoriesLinks[index].classList.add(this.categoriesLinkActiveClass);
        }
    }
}