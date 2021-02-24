// news


// load all news from server on page
export class News {

    constructor(data) {
        this.data = data;
        this.newsWrapper = document.getElementsByClassName('home__news').item(0);
        this.viewAllButton = 0;
    }

    loadNews() {
        if (this.data) {
            // get view all button from DOM
            this.viewAllButton = this.newsWrapper.getElementsByClassName('button').item(0);

            // send this pointer to event listener handler function via bind
            this.viewAllButton.addEventListener('click', this.updateNews.bind(this));
        }
    }

    // update news on page
    updateNews(e) {
        e.preventDefault();

        this.removeNews();

        var numberOfNews = this.data.length;

        for (let i = 0; i < numberOfNews; i++) {
            let currentNews = this.createNewsHTML(this.data[i]);

            // insert news before view all button
            this.viewAllButton.before(currentNews);
        }

        // remove view all button when news from server are updated
        this.newsWrapper.removeChild(this.viewAllButton);
    }

    // remove news from page
    removeNews() {
        var news = this.newsWrapper.getElementsByClassName('news');
        var numberOfNews = news.length;

        for (let i = 0; i < numberOfNews; i++) this.newsWrapper.removeChild(news.item(0));
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
        about.append(document.createTextNode('\n'));  // add text node as new line
        about.append(category);

        return news;
    }
}