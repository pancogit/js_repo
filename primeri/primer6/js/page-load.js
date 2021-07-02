// page loading process javascript

export default class PageLoad {

    constructor() {
        let windowObj = $('.page-load');

        // if page load window is on page, then get them
        // otherwise create new one and add them to the page
        this.loadWindow = windowObj.length ? windowObj : this.createWindowHTML();

        if (!windowObj.length) this.addToPage();

        this.waitTime = 0; // 2000;
    }

    createWindowHTML() {
        var pageLoad = $('<div>').addClass('page-load d-flex align-items-center');
        var icon = $('<i>').addClass('fas fa-cog page-load__icon flex-grow-1');

        pageLoad.append(icon);

        return pageLoad;
    }

    addToPage() {
        $(document.body).append(this.loadWindow);
    }

    removeFromPage() {
        $(this.loadWindow).detach();
    }
}