// load data from server on page


export class LoadData {

    constructor(serverData) {
        this.data = serverData;
        this.cardImageSize = 70;
        this.cardsClass = 'home__cards';
        this.cards = document.getElementsByClassName(this.cardsClass).item(0);
        this.newsClass = 'home__news';
        this.news = document.getElementsByClassName(this.newsClass).item(0);
        this.asideClass = 'home__aside';
        this.aside = document.getElementsByClassName(this.asideClass).item(0);
    }

    // load server data on page
    loadDataOnPage() {
        this.loadBussinessListing();
        this.loadNews();
        this.loadAside();
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
            let news = this.createNewsHTML(this.data.latest_news[i]);
            this.news.append(news);
        }

        // add view all button to page
        var viewAll = this.createViewAllHTML();
        this.news.append(viewAll);
    }

    // create HTML for news
    createNewsHTML(element) {
        var news = document.createElement('article');
        var content = document.createElement('div');
        var info = document.createElement('div');
        var heading = document.createElement('h3');
        var text = document.createElement('p');
        var date = document.createElement('div');
        var about = document.createElement('div');
        var icon = document.createElement('i');
        var category = document.createElement('span');

        news.classList.add('news');
        content.classList.add('news__content');
        info.classList.add('news__info');
        heading.classList.add('news__heading');
        heading.textContent = element.heading;
        text.classList.add('news__text');
        text.textContent = element.text;
        date.classList.add('news__date');
        date.textContent = element.date;
        about.classList.add('news__about');
        icon.classList.add('fas', 'fa-broadcast-tower', 'news__icon');
        category.classList.add('news__category');
        category.textContent = element.category;

        news.append(content);
        news.append(info);
        content.append(heading);
        content.append(text);
        info.append(date);
        info.append(about);
        about.append(icon);
        about.append(category);

        return news;
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
        var lawyerBox = this.createLawyerHTML(this.data.lawyers);

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
        
        lawyer.append(heading);
        lawyer.append(content);
        content.append(category);
        content.append(state);
        content.append(city);
        content.append(button);
        button.append(pointer);
        button.append(search);

        return lawyer;
    }

    // create first option for select list
    createFirstOptionHTML(optionClass, optionText) {
        var optionFirst = document.createElement('option');

        optionFirst.classList.add(optionClass);
        optionFirst.value = 'select';
        optionFirst.selected = 'selected';
        optionFirst.disabled = 'disabled';
        optionFirst.textContent = optionText;

        return optionFirst;
    }
}