// load data from server on page


export class LoadData {

    constructor(serverData, newsObject, lawyerObject) {
        this.data = serverData;
        this.cardImageSize = 70;
        this.cardsClass = 'home__cards';
        this.cards = document.getElementsByClassName(this.cardsClass).item(0);
        this.newsObject = newsObject;
        this.news = this.newsObject.newsWrapper;
        this.lawyerObject = lawyerObject;
        this.asideClass = 'home__aside';
        this.aside = document.getElementsByClassName(this.asideClass).item(0);
    }

    // load server data on page if data is loaded properly
    loadDataOnPage() {
        if (this.data) {
            this.loadBussinessListing();
            this.loadNews();
            this.loadAside();
        }
    }

    // load busssiness listing cards on page
    loadBussinessListing() {
        this.removeElements(this.cards);

        this.data.bussiness_listing.forEach(function iterate(element) {
            let card = this.createCardHTML(element);
            this.cards.append(card);
        }, this);  // send this pointer to foreach function
    }

    // remove static elements from page
    removeElements(parentElement) {
        while (parentElement.firstElementChild) parentElement.removeChild(parentElement.firstElementChild);
    }

    // create HTML for card
    createCardHTML(element) {
        var card = document.createElement('div');
        var left = document.createElement('div');
        var right = document.createElement('div');
        var link = document.createElement('a');
        var image = document.createElement('img');
        var heading = document.createElement('h3');
        var text = document.createElement('p');
        var buttonWrapper = document.createElement('div');
        var button = document.createElement('a');

        card.classList.add('card');
        left.classList.add('card__left');
        right.classList.add('card__right');
        link.classList.add('card__link');
        link.href = element.link;
        image.classList.add('card__image');
        image.src = element.image.path;
        image.alt = element.image.info;
        image.width = this.cardImageSize;
        image.height = this.cardImageSize;
        heading.classList.add('card__heading');
        heading.textContent = element.heading;
        text.classList.add('card__text');
        text.textContent = element.text;
        buttonWrapper.classList.add('card__button');
        button.classList.add('button');
        button.textContent = 'More...';
        button.href = element.link;
        
        card.append(left);
        card.append(right);
        left.append(link);
        link.append(image);
        right.append(heading);
        right.append(text);
        right.append(buttonWrapper);
        buttonWrapper.append(button)

        return card;
    }

    // load news on page
    loadNews() {
        this.removeElements(this.news);

        var numberOfNews = this.data.latest_news.length;
        var minNumberOfNews = numberOfNews >= 2 ? 2 : numberOfNews;

        // add just two news on page initially, but later they can be appended to page when view all button is clicked
        for (let i = 0; i < minNumberOfNews; i++) {
            let news = this.newsObject.createNewsHTML(this.data.latest_news[i]);
            this.news.append(news);
        }

        // add view all button to page
        var viewAll = this.createViewAllHTML();
        this.news.append(viewAll);
    }

    // create view all button
    createViewAllHTML() {
        var viewAll = document.createElement('a');

        viewAll.textContent = 'View All...';
        viewAll.classList.add('button');
        viewAll.href = 'index.html';

        return viewAll;
    }

    // load aside part of page
    loadAside() {
        this.removeAside();

        // create articles
        var usefulArticles = this.createArticlesHTML(this.data.articles[0]);
        var courtJudgements = this.createArticlesHTML(this.data.articles[1]);

        // create ads
        var promotingSuccessAd = this.createAdHTML(this.data.adLinks[0], true);
        var propertyLawAd = this.createAdHTML(this.data.adLinks[1]);

        // create lawyer box
        var lawyerBox = this.lawyerObject.createLawyerHTML(this.data.lawyers);

        // add aside elements to the page
        this.aside.append(lawyerBox);
        this.aside.append(usefulArticles);
        this.aside.append(promotingSuccessAd);
        this.aside.append(courtJudgements);
        this.aside.append(propertyLawAd);
    }

    // remove static aside part of page
    removeAside() {
        this.removeElements(this.aside);
    }

    // create HTML for articles
    createArticlesHTML(element) {
        var articles = document.createElement('article');
        var heading = document.createElement('div');
        var list = document.createElement('ul');
        var articles = document.createElement('article');
        var articles = document.createElement('article');

        articles.classList.add('articles', 'home__articles');
        heading.classList.add('articles__heading');
        heading.textContent = element.heading;
        list.classList.add('articles__list');

        var serverLinks = element.links;

        // add articles from server
        for (let i = 0; i < serverLinks.length; i++) {
            let article = document.createElement('li');
            let link = document.createElement('a');

            article.classList.add('articles__item');
            link.classList.add('articles__link');
            link.href = serverLinks[i].link;
            link.textContent = serverLinks[i].text;

            article.append(link);
            list.append(article);
        }

        articles.append(heading);
        articles.append(list);

        return articles;
    }

    // create HTML for ad
    createAdHTML(element, addMargin = false) {
        var ad = document.createElement('div');
        var link = document.createElement('a');
        var image = document.createElement('img');

        ad.classList.add('ad');

        if (addMargin) ad.classList.add('ad--margin');

        link.classList.add('ad__link');
        link.href = element.link;
        image.classList.add('ad__image');
        image.src = element.image.path;
        image.alt = element.image.info;
        
        ad.append(link);
        link.append(image);

        return ad;
    }
}