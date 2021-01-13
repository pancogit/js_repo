// subscribe with email in the footer


(function subscribe() {

    var email = document.getElementById('subscribe__email-id');
    var form = document.getElementById('subscribe-id');

    // disable html5 validation, because custom validation of form will be used
    form.noValidate = true;

    // when form is submitted fire event
    form.addEventListener('submit', submitForm);

    // check if email is correct, and if it is close form and show message
    function submitForm(e) {
        e.preventDefault();

        let emailText = email.value;

        // regular expression for matching email address
        // whitespaces at the beginning and at the end are allowed
        // first one or more letters followed by zero or more letters or numbers
        // after that dot . followed by one or more letters followed by zero or more 
        // letters or numbers may come once or not
        // then @ comes
        // one or more letters followed by zero or more letters or numbers is next
        // then dot . comes
        // finally, two to four small letters may come
        let regExpr = /^\s*[a-zA-Z]+\w*(\.[a-zA-Z]+\w*){0,1}@[a-zA-Z]+\w*\.[a-z]{2,4}\s*$/;

        // if email is not in good format, show error
        if (!emailText.match(regExpr)) {
            alert;
        }
    }

}());