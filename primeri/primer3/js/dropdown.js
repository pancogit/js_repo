// dropdown


export class Dropdown {

    constructor() {
        this.dropdown = document.getElementsByClassName('dropdown');
        this.showClass = 'show';
        this.plus = [];
        this.list = [];
        this.dropdownLinkClass = 'dropdown__link';

        this.initPlusList();
    }

    // for each dropdown, get plus icon and dropdown list from DOM
    initPlusList() {
        for (let i = 0; i < this.dropdown.length; i++) {
            let dropdownElement = this.dropdown[i].getElementsByClassName('navigation__plus').item(0);
            let listElement = this.dropdown[i].getElementsByClassName('dropdown__list').item(0);

            this.plus.push(dropdownElement);
            this.list.push(listElement);
        }
    }

    dropdownMenu() {
        // add event listeners for all dropdowns on page
        // send this pointer to handle function and index of dropdown
        for (let i = 0; i < this.dropdown.length; i++) {
            this.dropdown[i].addEventListener('click', this.toggleDropdown.bind(this, i));
        }
    }

    toggleDropdown(index, e) {
        var dropdownLinkClicked = e.target.classList.contains(this.dropdownLinkClass);
        var currentList = this.list[index];
        var currentPlus = this.plus[index];
        var dropdownExpanded;

        // prevent default link behavior only if dropdown link is not clicked
        if (!dropdownLinkClicked) e.preventDefault();

        this.hideLists(false, index);

        currentList.classList.toggle(this.showClass);
        dropdownExpanded = currentList.classList.contains(this.showClass);

        // toggle between plus and minus
        // add minus as HTML with HTML entity because it's looks better
        if (dropdownExpanded) currentPlus.innerHTML = '&minus;';
        else currentPlus.textContent = '+';
    }

    // hide all lists and restore pluses if boolean argument is true
    // or hide all except that with given index if boolean argument is false
    hideLists(hideAll = true, index = 0) {
        for (let i = 0; i < this.list.length; i++) {
            if (hideAll) this.hideListRestorePlus(i);
            else {
                if (i !== index) this.hideListRestorePlus(i);
            }
        }
    }

    hideListRestorePlus(index) {
        this.list[index].classList.remove(this.showClass);
        this.plus[index].textContent = '+';
    }
}