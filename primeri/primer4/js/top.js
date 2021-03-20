// top


export class Top {

    constructor() {
        this.top = document.getElementsByClassName('top').item(0);
        this.showClass = 'top--full-opacity';
    }

    addEvent() {
        window.addEventListener('scroll', this.showTopIcon.bind(this));
        this.top.addEventListener('click', this.goToTop.bind(this))
    }

    // show top icon after right vertical scroll percentage
    showTopIcon(event) {
        var wholeDocumentHeight = document.documentElement.scrollHeight;
        var scrollY = window.scrollY;
        var percentage = (scrollY / wholeDocumentHeight) * 100;

        if (percentage > 10) this.top.classList.add(this.showClass);
        else this.top.classList.remove(this.showClass);
    }

    // reset scroll to the top of page
    goToTop(event) {
        event.preventDefault();
        window.scroll(0, 0);
    }
}