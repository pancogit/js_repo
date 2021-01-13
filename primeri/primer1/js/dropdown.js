// dropdown menu


// when dropdown menu is clicked, show menu and change dropdown arrow
(function dropdown() {

    // get all dropdowns from DOM
    var dropdownList = document.getElementsByClassName('dropdown');
    var listAll = document.getElementsByClassName('dropdown__list');

    // add event listener for every dropdown
    for (let i = 0; i < dropdownList.length; i++) {
        dropdownList[i].addEventListener('click', toggleDropdown);
    }

    // toggle dropdown menu
    function toggleDropdown(e) {
        var target = e.target;
        var dropdown;

        if (!target.classList.contains('dropdown__icon')) {
            dropdown = target.parentElement;
        } 
        else {
            dropdown = target.parentElement.parentElement;
        }

        var list = dropdown.getElementsByClassName('dropdown__list')[0];
        var icon = dropdown.getElementsByClassName('dropdown__icon')[0];

        // if it's not dropdown link
        if (!target.classList.contains('dropdown__link')) {
            e.preventDefault();

            // close other dropdowns
            for (let i = 0; i < listAll.length; i++) {
                if (listAll[i] !== list) listAll[i].classList.remove('show');
            }

            // toggle dropdown list
            list.classList.toggle('show');

            // toggle icon arrow
            if (icon.classList.contains('fa-angle-down')) {
                icon.classList.remove('fa-angle-down');
                icon.classList.add('fa-angle-up');
            }
            else if (icon.classList.contains('fa-angle-up')) {
                icon.classList.remove('fa-angle-up');
                icon.classList.add('fa-angle-down');
            }
        }
    }

    // close all dropdowns when out of dropdown is clicked anywhere on window
    window.addEventListener('click', closeDropdown);

    // close dropdown windows
    function closeDropdown(e) {
        var target = e.target;
        var icons = [];

        var targetIcon;

        // select icon from target
        if (!target.classList.contains('dropdown__icon')) {
            targetIcon = target.getElementsByClassName('dropdown__icon')[0];
        }
        else {
            targetIcon = target;
        }
        
        // get all dropdown icons from DOM
        for (let i = 0; i < dropdownList.length; i++) {
            icons[i] = dropdownList[i].getElementsByClassName('dropdown__icon')[0];
        }

        // set other dropdown icons to down
        for (let i = 0; i < icons.length; i++) {
            if (icons[i] !== targetIcon) {
                icons[i].classList.remove('fa-angle-up');
                icons[i].classList.add('fa-angle-down');
            }
        }

        // if it's not dropdown link, arrow or icon, close dropdowns
        if (!target.classList.contains('dropdown__link')  && 
            !target.classList.contains('dropdown__arrow') &&
            !target.classList.contains('dropdown__icon')) {

            for (let i = 0; i < listAll.length; i++) {
                listAll[i].classList.remove('show');
            }
        }
    }

}());
