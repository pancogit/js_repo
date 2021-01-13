// user login box


(function login() {

    // get user info from DOM
    var userLink = document.getElementById('header__link--user-id');
    var userLogin = document.getElementById('login-id');
    var circle = document.getElementById('header__circle-id');
    var icon = document.getElementById('header__icon--user-id');
    var loginContent = document.getElementById('login__content-id');
    var loginEnd = document.getElementById('login__end-id');

    // add event listener when link is clicked
    userLink.addEventListener('click', openLogin);

    // open login box when link is clicked
    function openLogin(e) {
        // prevent link to redirect
        e.preventDefault();

        // show login box
        userLogin.classList.add('show');
    }

    // close login box when anywhere on window is clicked out of login box or login icon
    window.addEventListener('click', closeLogin);

    // close login box
    function closeLogin(e) {
        var target = e.target;

        // close login box only if login box is not clicked or login icon
        if (target !== userLogin    && target !== userLink &&
            target !== circle       && target !== icon     && 
            target !== loginContent && target !== loginEnd) {
            userLogin.classList.remove('show');
        }
    }

}());