// breadcrumbs top menu


export default class Breadcrumbs {

    constructor(data, searchElement) {
        this.serverData = data;
        this.navigation = 0;
        this.navigationObject = 0;
        this.search = searchElement;
        this.header = 0;
        this.breadcrumbsContainer = $('.breadcrumbs .row');
        this.homepageLink = this.breadcrumbsContainer.find('.breadcrumbs__main');
        this.navigationActiveLink = 0;
        this.navigationActiveLinkPath = [];
        this.activeLinkFound = false;

        // current cached folder in breadcrumb menu
        this.currentCachedFolder = this.serverData.home;

        this.navigationClass = 'navigation';
        this.linkClass = 'navigation__link';
        this.textClass = 'navigation__text';
        this.submenuClass = 'navigation__submenu';
        this.activeLinkClass = 'navigation__link--active';
        this.homepageActiveClass = 'breadcrumbs__main--active';

        // when homepage is clicked, empty breadcrumbs and go to homepage
        $(this.homepageLink).on('click', this.emptyBreadcrumbs.bind(this));
    }

    setFolderPath() {
        if (!this.navigation) this.navigation = $(`.${this.navigationClass}`);

        // set default homepage path or active folder path
        if (!this.setHomepage()) {
            this.findActiveLinkPath(this.serverData.home.folders);
            this.setPathOnPage();
        }
    }

    // if there is no active link, then it's homepage
    // returns true if it's homepage, otherwise return false
    setHomepage() {
        var activeLink = this.navigation.find(`.${this.activeLinkClass}`);
        var noActiveLink = !activeLink.length;

        // save active link
        this.navigationActiveLink = noActiveLink ? 0 : activeLink[0];

        // remove all links except homepage from page
        this.removeBreadcrumbLinks();

        // set homepage active
        if (noActiveLink) {
            this.homepageLink.addClass(this.homepageActiveClass);

            return true;
        }
        // homepage link is not active anymore
        else {
            this.homepageLink.removeClass(this.homepageActiveClass);

            return false;
        }
    }

    // remove all breadcrumb links from page except homepage link
    removeBreadcrumbLinks() {
        let links = this.breadcrumbsContainer.find('.breadcrumbs__item');
        let numberOfLinks = links.length;

        for (let i = 0; i < numberOfLinks; i++) $(links[i]).remove();
    }

    // find path for active navigation link
    findActiveLinkPath(folders) {

        for (let i = 0; i < folders.length; i++) {
            let currentLink = folders[i].link;

            // active link is found
            if (currentLink === this.navigationActiveLink) {
                this.setActiveLinkPath(folders[i]);
                this.activeLinkFound = true;

                // save current cached folder
                this.currentCachedFolder = folders[i];
            }

            // don't search anymore if link is found
            if (this.activeLinkFound) return;

            // search in nested folders
            this.findActiveLinkPath(folders[i].folders);
        }
    }

    setActiveLinkPath(activeFolder) {
        // set last link in path first
        this.navigationActiveLinkPath.push({
            name: activeFolder.name,
            link: activeFolder.link
        });

        // search DOM backwards and push parent links with names into array
        this.searchActiveLinksBackwards(activeFolder);

        // active link path is formed, reverse array
        this.navigationActiveLinkPath.reverse();
    }

    searchActiveLinksBackwards(activeFolder) {
        var currentLink = $(activeFolder.link);

        while (!currentLink.hasClass(this.navigationClass)) {
            currentLink = currentLink.parent();

            let isSubmenu = currentLink.hasClass(this.submenuClass);

            // if it's submenu, then move to the link
            if (isSubmenu) currentLink = currentLink.prev();

            let isLink = currentLink.hasClass(this.linkClass);

            // push parent link into array
            if (isLink) {
                let text = currentLink.find(`.${this.textClass}`);

                this.navigationActiveLinkPath.push({
                    name: text.text(),
                    link: currentLink[0]
                });
            }
        }
    }

    setPathOnPage() {

        this.navigationActiveLinkPath.forEach(function iterate(value, index, array) {
            let lastLink = index === array.length - 1;
            let item = this.createBreadcrumbHTML(value, lastLink);

            // add breadcrumb to the page
            this.breadcrumbsContainer.append(item);
        }, this);

        // remove path for active link after page update
        this.navigationActiveLinkPath.length = 0;
        this.activeLinkFound = false;

    }

    createBreadcrumbHTML(element, activeLink = false) {
        var item = $('<span>').addClass('breadcrumbs__item col-auto');
        var link = $('<a>').addClass('breadcrumbs__link').attr('href', element.link.pathname).text(element.name);
        
        // add event listener to the link and bind this pointer along with navigation link reference
        link.on('click', this.breadcrumbIsClicked.bind(this, element.link));

        if (activeLink) link.addClass('breadcrumbs__link--active');

        item.append(link);

        return item;
    }

    breadcrumbIsClicked(navigationLink, event) {
        event.preventDefault();

        // call event on navigation link like it's clicked
        $(navigationLink).click();
    }

    emptyBreadcrumbs(event) {
        event.preventDefault();

        // remove all links and disable homepage link
        this.removeBreadcrumbLinks();
        this.homepageLink.addClass(this.homepageActiveClass);

        // restore files and navigation for homepage
        this.navigationObject.add(true);

        // current folder is homepage
        this.currentCachedFolder = this.serverData.home;

        // when home folder is clicked, then set default icon for sorting to skip 
        // sorting already sorted folder
        this.header.setDefaultSortIcon();

        // remove search results from page with click event fire
        this.search.removeSearchResults();
    }
}