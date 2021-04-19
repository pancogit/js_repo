// article-block for articles


class ArticleBlock {

    constructor(data, wrapperID, hasDate = false) {
        this.data = data;
        this.wrapperID = wrapperID;
        this.wrapperEl = document.getElementById(this.wrapperID);
        this.hasDate = hasDate;
        this.articleClass = 'article-block';
        this.headingClass = 'article-block__heading';
        this.textClass = 'article-block__text';
        this.readMoreClass = 'article-block__read-more';
    }

    addArticles() {
        this.clearArticles();

        // add articles data from server on page
        this.data.forEach(element => {
            let article = this.createArticle(element);
            this.wrapperEl.append(article);
        });
    }

    // clear articles from page
    clearArticles() {
        while (this.wrapperEl.firstElementChild) {
            this.wrapperEl.removeChild(this.wrapperEl.firstElementChild);
        }
    }

    // create article html
    createArticle(elem) {
        var article = document.createElement('article');
        var heading = document.createElement('h3');
        var text = document.createElement('p');
        var read = document.createElement('a');

        article.classList.add('article-block');
        heading.classList.add('article-block__heading');
        heading.textContent = elem.heading;
        text.classList.add('article-block__text');
        read.classList.add('article-block__read-more');

        // add text with maximum of 200 characters
        if (this.hasDate) {
            text.innerHTML = elem.date + '<br />' + elem.text.substr(0, 200);

            // append three dots at the end if it's not single dot at the end
            if (text.innerHTML[text.innerHTML.length - 1] !== '.') text.innerHTML += '... ';
            else text.innerHTML += ' ';
        }
        else {
            text.textContent = elem.text[0].substr(0, 200);

            // append three dots at the end if it's not single dot at the end
            if (text.textContent[text.textContent.length - 1] !== '.') text.textContent += '... ';
            else text.textContent += ' ';
        }

        read.href = elem.link.direct;
        read.textContent = 'Read More';

        article.append(heading);
        article.append(text);
        text.append(read);

        return article;
    }
}