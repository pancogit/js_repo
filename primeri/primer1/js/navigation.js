// navigation menu for hamburger menu


function navigation() {

    var hamburgerLink = document.getElementById('hamburger__link-id');
    var navigation = document.getElementById('navigation-id');
    var close = document.getElementById('navigation__close-link-id');

    // show navigation when hamburger link is clicked
    hamburgerLink.addEventListener('click', showNavigation);

    function showNavigation(e) {
        e.preventDefault();

        // show navigation
        navigation.classList.add('show');
    }

    // hide navigation when close button is clicked
    close.addEventListener('click', hideNavigation);

    function hideNavigation(e) {
        e.preventDefault();

        // hide navigation
        navigation.classList.remove('show');
    }

    // close navigation when out of navigation is clicked
    window.addEventListener('click', closeNavigation);

    function closeNavigation(e) {
        var target = e.target;
         
        // close navigation if it's opended and if it's not any of navigation elements clicked
        if (navigation.classList.contains('show')           &&
            target !== navigation                           &&
            target !== hamburgerLink                        &&
            !target.classList.contains('hamburger__icon')   &&
            !target.classList.contains('navigation__close') &&
            !target.classList.contains('dropdown__arrow')   &&
            !target.classList.contains('navigation__link')  &&
            !target.classList.contains('dropdown__link')    &&
            !target.classList.contains('dropdown__icon')) {

            navigation.classList.remove('show');
        }
    }

}