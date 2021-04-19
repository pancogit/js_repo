// article-page


// whole article on page
class ArticlePage {

    constructor(dataFromServer) {
        this.mainEl = document.getElementById('main-id');
        this.data = dataFromServer;

        this.dataSet = this.getDataSet();
    }

    // get data set for different articles
    getDataSet() {
        if (this.mainEl.dataset.news) 
            return { 
                id: this.mainEl.dataset.news, 
                type: 'news' 
            };

        if (this.mainEl.dataset.tweets) 
            return {
                id: this.mainEl.dataset.tweets,
                type: 'tweets'
            };

        if (this.mainEl.dataset.tips) 
            return {
                id: this.mainEl.dataset.tips,
                type: 'tips'
            }
        
        // type is not found
        return 0;
    }

    // update detailed article on page
    updateArticle() {
        let article = this.createHTML();

        // remove static data and add server data to the page if article is found on server
        if (article) {
            this.mainEl.removeChild(this.mainEl.firstElementChild);
            this.mainEl.append(article);
        }
    }

    // create HTML for detailed article
    createHTML() {
        // get article object from server data
        var object = this.getArticleObject();

        // if article is not found, skip
        if (!object) return 0;

        var wrapperContent = document.createElement('div');
        var heading = document.createElement('h2');
        var content = document.createElement('article');
        var text = this.initText(object);
        var redirect = this.initRedirectLink();

        wrapperContent.classList.add('wrapper__content');
        heading.classList.add('article-page__heading');
        heading.textContent = object.heading;
        content.classList.add('article-page__content');

        wrapperContent.append(heading);
        wrapperContent.append(content);
        content.append(text);
        wrapperContent.append(redirect);

        return wrapperContent;
    }

    // get article object
    getArticleObject() {
        var articles;

        // type is not found
        if (!this.dataSet) return 0;

        switch(this.dataSet.type) {
            case 'news':
                articles = this.data.news;
                break;
            case 'tweets':
                articles = this.data.tweets;
                break;
            case 'tips':
                articles = this.data.tips;
                break;
        }

        return this.findArticleObject(articles, this.dataSet.id);
    }

    // find article object
    findArticleObject(object, id) {
        for (let i = 0; i < object.length; i++) {
            if (object[i].id === id) return object[i];
        }

        return 0;
    }

    // init text for article
    initText(object) {
        var text = document.createElement('div');
        var textObj = object.text;

        text.classList.add('article-page__text');

        // add paragraphs to text
        if (this.dataSet.type === 'news') {
            textObj.forEach(element => {
                let paragraph = document.createElement('p');

                paragraph.classList.add('article-page__paragraph');
                paragraph.textContent = element;

                text.append(paragraph);
            });
        }
        // tweets or tips with single paragraph
        else {
            let date = document.createElement('p');
            let content = document.createElement('p');

            date.classList.add('article-page__paragraph');
            date.textContent = object.date;
            content.classList.add('article-page__paragraph');
            content.textContent = textObj;

            text.append(date);
            text.append(content);
        }

        return text;
    }

    // init redirect link
    initRedirectLink() {
        var redirect = document.createElement('a');
        var text = document.createElement('span');
        var icon = document.createElement('i');

        redirect.classList.add('redirect');
        redirect.href = 'index.html';
        text.classList.add('redirect__text');

        var type = this.dataSet.type;

        // set data set type to text with first letter uppercase
        text.textContent = type[0].toUpperCase() + type.slice(1, type.length);

        icon.classList.add('fas', 'fa-chevron-right', 'redirect__arrow');

        redirect.append(text);
        redirect.append(icon);

        return redirect;
    }
}