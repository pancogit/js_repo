// subscribe


export class Subscribe {

    constructor() {
        this.subscribe = document.getElementsByClassName('subscribe').item(0);
        this.email = this.subscribe.email;
        this.errorClass = 'subscribe__email--error';
        this.placeholder = {
            normal: 'Enter your email',
            error: 'Please enter valid email address'
        }
    }

    addEvents() {
        // use javascript for validation
        this.subscribe.noValidate = true;
        this.subscribe.addEventListener('submit', this.checkEmail.bind(this));
    }

    checkEmail(event) {
        var emailText = this.email.value;

        // words optionally followed by dot and words (one or more), then @,
        // then more words followed by dot and finally three characters for domain
        var regularExpression = /^\w+(\.\w+)*@\w+\.[a-z]{3}$/;
        var validEmail = emailText.match(regularExpression);

        // check for errors if email is empty or if it's not valid
        if(!emailText || !validEmail) {
            event.preventDefault();

            // clear input and add error to the page
            this.email.value = 0;
            this.email.value = '';
            this.email.classList.add(this.errorClass);
            this.email.placeholder = this.placeholder.error;
        }
        // email is valid, remove errors if exists
        else {
            this.email.classList.remove(this.errorClass);
            this.email.placeholder = this.placeholder.normal;
        }
    }
}