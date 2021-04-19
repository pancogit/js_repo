// dropdown


export class Dropdown {

    constructor(serverData) {
        this.data = serverData;
        this.newRecipes = 0;
        this.dropdownLinks = 0;
        this.categoryLinks = 0;
        this.topList = document.getElementById('top-10-list-id');
        this.topLink = document.getElementById('top-10-link-id');
        this.dropdownLinkClass = 'dropdown__link';
        this.dropdownTextClass = 'dropdown__text';
        this.showClass = 'show';
        this.categoriesLinkClass = 'categories__link';

        // one arrow for new recipes link and one for all list items
        this.newRecipesArrow = this.createArrowHTML();
        this.listItemArrow = this.createArrowHTML();
    }

    addRecipes() {
        this.removeStaticData();
        this.addDataFromServer();

        // add event listeners
        this.newRecipes.addEventListener('click', this.toggleDropdown.bind(this));
        this.topLink.addEventListener('click', this.showHideList.bind(this));
        window.addEventListener('click', this.closeDropdown.bind(this));

        // get category links from DOM
        this.categoryLinks = document.getElementsByClassName('categories').item(0)
            .getElementsByClassName(this.categoriesLinkClass);
    }

    removeStaticData() {
        this.newRecipes = document.getElementById('dropdown-new-recipes-id');
        var newRecipesParent = this.newRecipes.parentElement;
        var oldRecipes = this.newRecipes.nextElementSibling;

        newRecipesParent.removeChild(oldRecipes);
    }

    addDataFromServer() {
        var list = document.createElement('ul');

        list.classList.add('dropdown__list', 'navigation__list');

        for (let i = 0; i < this.data.length; i++)
            list.append(this.createListItemHTML(this.data[i]));

        // add list to the page
        this.newRecipes.after(list);
    }

    createListItemHTML(dataObject) {
        let listItem = document.createElement('li');
        let link = document.createElement('a');
        let text = document.createElement('span');
        let numberOfRecipes = document.createElement('span');

        listItem.classList.add('dropdown__item', 'navigation__item');
        link.classList.add(this.dropdownLinkClass, 'navigation__link');
        link.href = dataObject.link;
        text.classList.add(this.dropdownTextClass);
        text.textContent = dataObject.name;
        numberOfRecipes.classList.add(this.dropdownTextClass);
        numberOfRecipes.textContent = '(' + dataObject.recipes.length + ')';

        // change categories when dropdown link is clicked
        link.addEventListener('click', this.changeCategories.bind(this));

        listItem.append(link);
        link.append(text);

        // add text node for whitespace (HTML new line)
        link.append(document.createTextNode('\n'));

        link.append(numberOfRecipes);

        return listItem;
    }

    createArrowHTML() {
        var arrow = document.createElement('i');

        arrow.classList.add('fas', 'fa-chevron-right', 'dropdown__icon');

        return arrow;
    }

    // toggle dropdown list
    toggleDropdown(event) {
        event.preventDefault();

        var target = event.target;
        var isLink = target.classList.contains(this.dropdownLinkClass);
        var icon = this.newRecipes.firstElementChild;
        var isIcon = icon === this.newRecipesArrow;

        if (!isLink) target = target.parentElement;

        // toggle arrow and dropdown for top list
        if (isIcon) this.removeAllArrows();
        else {
            this.newRecipes.prepend(this.newRecipesArrow);
            this.newRecipes.nextElementSibling.classList.add(this.showClass);
        }
    }

    removeAllArrows() {
        let list = this.newRecipes.nextElementSibling;
        let arrow = list.getElementsByClassName('dropdown__icon').item(0);

        // remove arrow from DOM if exists
        if (arrow) arrow.parentElement.removeChild(arrow);

        this.newRecipes.removeChild(this.newRecipesArrow);
        this.newRecipes.nextElementSibling.classList.remove(this.showClass);
    }

    // change categories from dropdown
    changeCategories(event) {
        event.preventDefault();

        var target = event.target;
        var isLink = target.classList.contains(this.dropdownLinkClass);

        if (!isLink) target = target.parentElement;

        var hasIcon = target.firstElementChild === this.listItemArrow;

        // add icon to the current dropdown link, icon is used by reference and there is
        // no need to remove them before moving
        // don't add icon if the same link is clicked
        if (!hasIcon) target.prepend(this.listItemArrow);

        this.activateCategory(target);
    }

    // emulate clicking on category from dropdown
    activateCategory(target) {
        var text = target.getElementsByClassName(this.dropdownTextClass).item(0).textContent;

        for (let i = 0; i < this.categoryLinks.length; i++) {
            let categoryFound =
                this.categoryLinks[i].getElementsByClassName('categories__name').item(0).textContent === text;

            if (categoryFound) {
                this.categoryLinks[i].click();  // emulate click event
                break;
            }
        }
    }

    // show or hide whole dropdown
    showHideList(event, toggleOrCloseAll = true) {
        if (toggleOrCloseAll) {
            this.topList.classList.toggle(this.showClass);
            event.preventDefault();
        }
        else this.topList.classList.remove(this.showClass);

        let hasNewRecipesArrow = this.newRecipes.firstElementChild === this.newRecipesArrow;

        // remove everything about dropdown list and all arrows only if dropdown is expanded
        if (hasNewRecipesArrow) this.removeAllArrows();
    }

    closeDropdown(event) {
        // don't toggle dropdown, just close all if dropdown is not clicked
        if (!this.isDropdownClicked(event.target)) this.showHideList(event, false);
    }

    isDropdownClicked(target) {
        var dropdownIsClicked = false;
        var categoriesClicked = target.classList.contains(this.categoriesLinkClass);

        // if categories are clicked from dropdown link, then it's dropdown already
        if (categoriesClicked) return true;

        // search up to top to find dropdown
        while (target) {
            dropdownIsClicked = target.classList.contains('dropdown');

            if (dropdownIsClicked) break;

            target = target.parentElement;
        }

        return dropdownIsClicked;
    }
}