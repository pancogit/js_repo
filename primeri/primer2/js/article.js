// article 


// update articles on homepage
class Articles {

    constructor() {
        this.currentNewsIndex = 1;
        this.newsClass = 'article-news-id';
        this.news = document.getElementById(this.newsClass);

        this.tweetsClass = 'article-tweets-id';
        this.tweets = document.getElementById(this.tweetsClass);
        this.currentTweetsIndex = 1;

        this.tipsClass = 'article-tips-id';
        this.tips = document.getElementById(this.tipsClass);
        this.currentTipsIndex = 1;

        this.activeButtonClass = 'article__button--active';
    }
    
    // add news to the page
    updateNews(value) {
        var serverData = dataFromServer.news;

        // add first news
        this.addArticle(this.news, this.currentNewsIndex - 1, serverData);

        // get buttons and add event listeners
        this.updateArticleButtons(this.news, serverData);
    }

    // add tweets to the page
    updateTweets(value) {
        var serverData = dataFromServer.tweets;

        // add first tweet
        this.addArticle(this.tweets, this.currentTweetsIndex - 1, serverData);

        // get buttons and add event listeners
        this.updateArticleButtons(this.tweets, serverData);
    }

    // add tips to the page
    updateTips(value) {
        var serverData = dataFromServer.tips;

        // add first tip
        this.addArticle(this.tips, this.currentTipsIndex - 1, serverData);

        // get buttons and add event listeners
        this.updateArticleButtons(this.tips, serverData);
    }

    // add article with given index
    addArticle(article, index, dataServer) {

        // get elements from dom
        var heading = article.getElementsByClassName('article__subheading')[0];
        var text = article.getElementsByClassName('article__text')[0];

        // update article on page
        var articleServer = dataServer[index];
        heading.textContent = articleServer.heading;

        var characters;

        // get first 200 characters
        if (article === this.news) {
            characters = articleServer.text[0].substr(0, 200);
            text.textContent = characters + '... ';
        }
        else {
            characters = articleServer.text.substr(0, 200);
            text.innerHTML = articleServer.date + '<br>' + characters + '... ';
        }

        var readMore = this.createReadMore(articleServer.link.home);

        // add read more to the page
        text.append(readMore);
    }

    

    // update buttons on page for given article
    updateArticleButtons(article, dataServer) {
        var buttons = article.getElementsByClassName('article__button');
        var buttonLeft = buttons[0];
        var buttonRight = buttons[1];
        var numberOfArticles = dataServer.length;

        // update active buttons
        if (numberOfArticles) {
            buttonLeft.classList.remove(this.activeButtonClass);
            buttonRight.classList.add(this.activeButtonClass);
        }

        buttonLeft.addEventListener('click', this.articleButtonClicked);
        buttonRight.addEventListener('click', this.articleButtonClicked);
    }

    // when article button is clicked
    articleButtonClicked(e) {
        e.preventDefault();

        var target = e.target;

        // if arrow is clicked, target is parent element
        if (target.classList.contains('article__navigation')) target = target.parentElement;

        // exit from function if button is not active
        if (!target.classList.contains(this.activeButtonClass)) return;

        // get article element id
        var article = target.parentElement.parentElement.parentElement;
        var articleID = article.id;

        // left or right button clicked
        var leftOfRight = target.nextElementSibling;

        // get article information
        var articleInfo = this.getArticleInfo(articleID, leftOfRight);

        // add next article to the page
        this.addArticle(articleInfo.articleToAdd, articleInfo.index - 1, articleInfo.serverData);

        // update active button
        this.updateActiveButton(target, leftOfRight, articleInfo);
    }

    // update active button
    updateActiveButton(element, leftOfRightButton, info) {

        // left button clicked
        if (leftOfRightButton) {
            // first article reached, disable button and exit from function
            if (info.index === 1) {
                element.classList.remove(this.activeButtonClass);
                return;
            }

            let rightButton = leftOfRightButton;

            // update active right button
            if (info.index <= info.numberOfArticles - 1)
                rightButton.classList.add(this.activeButtonClass);
        }

        // right button clicked
        else {
            // last article reached, disable button and exit from function
            if (info.index === info.numberOfArticles) {
                element.classList.remove(this.activeButtonClass);
                return;
            }

            let leftButton = element.previousElementSibling;

            // update active left button
            if (info.index > 1) leftButton.classList.add(this.activeButtonClass);
        }
    }

    // get article information
    getArticleInfo(ID, leftOfRightButton) {
        var info = {};

        // update article information
        switch (ID) {
            case this.newsClass:
                if (leftOfRightButton) this.currentNewsIndex--;  // left button clicked
                else this.currentNewsIndex++;  // right button clicked

                info.index = this.currentNewsIndex;
                info.articleToAdd = this.news;
                info.serverData = dataFromServer.news;
                break;

            case this.tweetsClass:
                if (leftOfRightButton) this.currentTweetsIndex--;
                else this.currentTweetsIndex++;

                info.index = this.currentTweetsIndex;
                info.articleToAdd = this.tweets;
                info.serverData = dataFromServer.tweets;
                break;

            case this.tipsClass:
                if (leftOfRightButton) this.currentTipsIndex--;
                else this.currentTipsIndex++;

                info.index = this.currentTipsIndex;
                info.articleToAdd = this.tips;
                info.serverData = dataFromServer.tips;
                break;
        }

        info.numberOfArticles = info.serverData.length;

        return info;
    }

    // create read more link
    createReadMore(path) {
        var link = document.createElement('a');

        link.href = path;
        link.textContent = 'Read More';
        link.classList.add('article__read-more');

        return link;
    }
}