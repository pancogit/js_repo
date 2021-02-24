// lawyer


export class Laywer {

    constructor(data) {
        this.data = data;
        this.lawyerWrapper = 0;
        this.lawyerForm = 0;
        this.category = 0;
        this.state = 0;
        this.city = 0;
        this.currentCategory = 0;
        this.currentState = 0;
    }

    // update lawyer information
    updateLawyerInfo() {
        // if server data is not fetched, don't do anything
        if (!this.data) return;

        this.lawyerWrapper = document.getElementsByClassName('lawyer').item(0);
        this.lawyerForm = this.lawyerWrapper.getElementsByClassName('lawyer__content').item(0);
        this.category = this.lawyerForm.category;
        this.state = this.lawyerForm.state;
        this.city = this.lawyerForm.city;

        // when form is submitted, call handler function
        // send this pointer to event listener handler
        this.lawyerForm.addEventListener('submit', this.formIsSubmitted.bind(this));

        // add event listeners for select lists when selection is changed
        this.category.addEventListener('change', this.categoryIsChanged.bind(this));
        this.state.addEventListener('change', this.stateIsChanged.bind(this));
    }

    // form is submitted
    formIsSubmitted(e) {
        var notSelectedValue = 'select';
        var categoryOptionSelected = this.category.selectedOptions.item(0);
        var categoryNotSelected = categoryOptionSelected.value === notSelectedValue;
        var stateOptionSelected = this.state.selectedOptions.item(0);
        var stateNotSelected = stateOptionSelected.value === notSelectedValue;
        var cityOptionSelected = this.city.selectedOptions.item(0);
        var cityNotSelected = cityOptionSelected.value === notSelectedValue;
        var errorClass = 'lawyer__select--error';
        var goodClass = 'lawyer__select--good';

        // if any of select lists are not selected, then it's error
        if (categoryNotSelected || stateNotSelected || cityNotSelected) {
            e.preventDefault();

            this.addAllMessages(categoryNotSelected, stateNotSelected, cityNotSelected, errorClass, goodClass);
        }
        // remove all error and good messages from page if exists
        else this.removeAllMessages(errorClass, goodClass);
    }

    // add error if select list is not selected
    addSelectionError(notSelected, containsError, selectObject, errorClass, goodClass) {
        if (notSelected) {
            if (!containsError) {
                selectObject.classList.add(errorClass);
                selectObject.classList.remove(goodClass);
            }
        }
        else {
            if (containsError) selectObject.classList.remove(errorClass);

            let containsGood = selectObject.classList.contains(goodClass);
            if (!containsGood) selectObject.classList.add(goodClass);
        }
    }

    // add error message to page
    addErrorMessage(categoryNotSelected, stateNotSelected, cityNotSelected) {
        var errorMessageObject = this.city.nextElementSibling;
        var errorMessageObjectText = errorMessageObject.textContent;
        var errorMessageClass = 'lawyer__error';
        var errorOnPage = errorMessageObject.classList.contains(errorMessageClass);
        var errorMessage;

        // set error message text
        if (categoryNotSelected) errorMessage = 'Please select category';
        else if (stateNotSelected) errorMessage = 'Please select state';
        else if (cityNotSelected) errorMessage = 'Please select city';

        // insert new error message only if it's not the same
        if (errorOnPage) {
            if (errorMessageObjectText !== errorMessage) {
                this.lawyerForm.removeChild(errorMessageObject);
                this.insertErrorMessage(errorMessage, errorMessageClass);
            }
        }
        // there is no error message on page, insert new one
        else this.insertErrorMessage(errorMessage, errorMessageClass);
    }

    // create error message and insert into page
    insertErrorMessage(errorMessage, errorMessageClass) {
        var error = document.createElement('div');

        error.classList.add(errorMessageClass);
        error.textContent = errorMessage;
        this.city.after(error);
    }

    // add error and good messages to the page
    addAllMessages(categoryNotSelected, stateNotSelected, cityNotSelected, errorClass, goodClass) {
        var categoryContainsError = this.category.classList.contains(errorClass);
        var stateContainsError = this.state.classList.contains(errorClass);
        var cityContainsError = this.city.classList.contains(errorClass);

        // add error if select list is not selected
        this.addSelectionError(categoryNotSelected, categoryContainsError, this.category, errorClass, goodClass);
        this.addSelectionError(stateNotSelected, stateContainsError, this.state, errorClass, goodClass);
        this.addSelectionError(cityNotSelected, cityContainsError, this.city, errorClass, goodClass);

        // add error messages if they are not already there
        this.addErrorMessage(categoryNotSelected, stateNotSelected, cityNotSelected);
    }

    // remove both good and error messages
    removeAllMessages(errorClass, goodClass) {
        let errorMessage = this.lawyerForm.getElementsByClassName('lawyer__error').item(0);

        if (errorMessage) this.lawyerForm.removeChild(errorMessage);

        this.category.classList.remove(errorClass);
        this.category.classList.remove(goodClass);
        this.state.classList.remove(errorClass);
        this.state.classList.remove(goodClass);
        this.city.classList.remove(errorClass);
        this.city.classList.remove(goodClass);
    }

    // selection list for category is changed
    categoryIsChanged(e) {
        var option = e.target.selectedOptions.item(0);

        if (option) {
            let optionValue = option.value;
            let categories = this.data.categories;
            let states;

            // find states for selected category
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].value === optionValue) {
                    this.currentCategory = categories[i];
                    states = categories[i].states;
                    break;
                }
            }

            // remove old options for states and cities from page 
            this.removeOptions(this.state);
            this.removeOptions(this.city);

            // add default option for cities and add to page
            let cityDefaultOption = this.createDefaultOption('Select City');
            this.city.append(cityDefaultOption);

            // add new options for states from server
            this.addOptions(states, this.state, 'Select State');
        }
    }

    // selection list for state is changed
    stateIsChanged(e) {
        var option = e.target.selectedOptions.item(0);

        if (option) {
            let optionValue = option.value;
            let statesForCategory = this.currentCategory.states;
            let cities;

            // find cities for selected state
            for (let i = 0; i < statesForCategory.length; i++) {
                if (statesForCategory[i].value === optionValue) {
                    cities = statesForCategory[i].cities;
                    break;
                }
            }

            // remove old options from page and add new options from server
            this.removeOptions(this.city);
            this.addOptions(cities, this.city, 'Select City');
        }
    }

    // remove all options for given select list
    removeOptions(select) {
        if (select) {
            let numberOfOptions = select.length;

            for (let i = 0; i < numberOfOptions; i++) select.removeChild(select[0]);
        }
    }

    // add options from server on page for given select list
    addOptions(serverOptions, select, defaultOptionText) {
        if (serverOptions && select) {
            // add default option first
            let lawyerOptionClass = 'lawyer__option';
            let defaultOption = this.createDefaultOption(defaultOptionText);

            select.append(defaultOption);

            // add options from server
            serverOptions.forEach(function iterate(element) {
                let option = document.createElement('option');

                option.classList.add(lawyerOptionClass);
                option.value = element.value;
                option.textContent = element.name;

                select.append(option);
            });
        }
    }

    createDefaultOption(optionText) {
        let defaultOption = document.createElement('option');

        defaultOption.classList.add('lawyer__option');
        defaultOption.value = 'select';
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.textContent = optionText;

        return defaultOption;
    }

    // create lawyer box
    createLawyerHTML(element) {
        var lawyer = document.createElement('div');
        var heading = document.createElement('div');
        var content = document.createElement('form');
        var category = document.createElement('select');
        var state = document.createElement('select');
        var city = document.createElement('select');
        var button = document.createElement('button');
        var pointer = document.createElement('i');
        var search = document.createElement('span');

        lawyer.classList.add('lawyer', 'home__lawyer');
        heading.classList.add('lawyer__heading');
        heading.textContent = 'Find a Lawyer';
        content.classList.add('lawyer__content');
        content.method = 'get';
        category.classList.add('lawyer__select');
        category.name = 'category';
        state.classList.add('lawyer__select');
        state.name = 'state';
        city.classList.add('lawyer__select');
        city.name = 'city';
        button.classList.add('lawyer__submit');
        pointer.classList.add('fas', 'fa-hand-pointer', 'lawyer__pointer');
        search.classList.add('lawyer__search');
        search.textContent = 'Search';

        this.initOptions(category, state, city, element);

        lawyer.append(heading);
        lawyer.append(content);
        content.append(category);
        content.append(state);
        content.append(city);
        content.append(button);
        button.append(pointer);
        button.append(document.createTextNode('\n'));  // append new line as text node
        button.append(search);

        return lawyer;
    }

    // add initial options for category, state and city
    initOptions(category, state, city, element) {
        // add first select option for categories
        var optionClass = 'lawyer__option';
        var categoryOptionFirst = this.createFirstOptionHTML(optionClass, 'Select Category');

        category.append(categoryOptionFirst);

        var categoriesObject = element.categories;

        // add categories from server
        categoriesObject.forEach(function iterate(value) {
            let option = document.createElement('option');

            option.classList.add(optionClass);
            option.textContent = value.name;
            option.value = value.value;

            category.append(option);
        });

        // add first options for state and city
        var stateOptionFirst = this.createFirstOptionHTML(optionClass, 'Select State');
        var cityOptionFirst = this.createFirstOptionHTML(optionClass, 'Select City');

        state.append(stateOptionFirst);
        city.append(cityOptionFirst);
    }

    // create first option for select list
    createFirstOptionHTML(optionClass, optionText) {
        var optionFirst = document.createElement('option');

        optionFirst.classList.add(optionClass);
        optionFirst.value = 'select';
        optionFirst.selected = true;
        optionFirst.disabled = true;
        optionFirst.textContent = optionText;

        return optionFirst;
    }
}