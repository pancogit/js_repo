// comments on page


function comments() {

    // comment input and controls from DOM
    var input = document.getElementById('comment__input-id');
    var controls = document.getElementById('comment__controls-id');

    input.addEventListener('focus', showControls);

    // show comment controls
    function showControls(e) {
        controls.classList.add('show');
    }

    var submit = document.getElementById('comment__submit-id');
    var cancel = document.getElementById('comment__cancel-id');
    var commentsContainer = document.getElementById('badge__wrapper--comments-id');

    cancel.addEventListener('click', hideControls);

    // hide comment controls
    function hideControls(e) {
        e.preventDefault();

        // clear content and remove errors if exist
        controls.classList.remove('show');
        input.value = '';

        // if cancel is clicked and controls are not at the top of comments (for reply post)
        // then move comment input and controls to the top of comments
        if (commentsContainer.firstElementChild !== input) {
            input.remove();
            controls.remove();
            commentsContainer.prepend(input);
            input.after(controls);
        }

        // remove error info from page
        if (input.classList.contains(inputErrorClass)) {
            input.classList.remove(inputErrorClass);
            inputErrorMessage.remove();
        }
    }

    submit.addEventListener('click', postComment);

    // error message
    var inputErrorClass = 'comment__input--error';
    var inputErrorMessage = document.createElement('p');

    inputErrorMessage.classList.add('comment__message', 'comment__message--error');
    inputErrorMessage.textContent = 'Empty comments cannot be posted!'

    // function for posting comment
    function postComment(e) {
        e.preventDefault();

        // get comment text
        var comment = input.value;

        // search for whitespaces or for empty string (zero whitespaces) 
        // with regular expression from the beginning to the end of the comment string
        var emptyComment = comment.match(/^\s*$/);

        // if comment is empty, show error
        if (emptyComment) {
            if (!input.classList.contains(inputErrorClass)) {
                input.classList.add(inputErrorClass);
                input.after(inputErrorMessage);
            }
        }
        // comment is not empty, remove error
        else {
            input.classList.remove(inputErrorClass);
            inputErrorMessage.remove();
            input.value = '';

            // post comment and hide controls from page
            let commentPost = createComment(comment);

            // insert comment into page (normal comment post or reply post)
            insertComment(commentPost);

            // add comment in comments array
            cacheComment(commentPost);
        }
    }

    // insert comment into DOM to the right place
    function insertComment(comment) {

        // if reply comment is posted, then it must be inserted as reply comment in DOM
        // insert comment bellow comment controls
        controls.after(comment);
        controls.classList.remove('show');

        // check if comment is reply or not
        // if comment input is not at the beginning, then it's reply comment post
        if (commentsContainer.firstElementChild !== input) {
            // add reply modifier class
            comment.classList.add('comment__box--reply');

            // move comment input and controls at the beginning because reply comment is posted
            input.remove();
            controls.remove();
            commentsContainer.prepend(input);
            input.after(controls);
        }
    }

    // add new comment in comments array
    function cacheComment(comment) {
        // create new comment object
        var newComment = {};

        var image = comment.getElementsByClassName('comment__image')[0];
        var link = comment.getElementsByClassName('comment__link')[0];
        var user = comment.getElementsByClassName('comment__user')[0];
        var commentPosted = comment.getElementsByClassName('comment__text')[0];
        var count = comment.getElementsByClassName('comment__count')[0];
        var date = comment.getElementsByClassName('comment__date')[0];

        // add fields in comment object
        newComment.picture = image.src;
        newComment.picture_info = image.alt;
        newComment.link = link.href;
        newComment.user = user.textContent;
        newComment.comment = commentPosted.textContent;
        newComment.likeList = {};
        newComment.likeList.numberOfLikes = count.textContent;
        newComment.likeList.persons = [];
        newComment.date = date.textContent;
        newComment.reply = [];

        // save comment ID to comment array
        newComment.id = comment.id;

        // add new comment in comments array
        // if it's not reply, then push them into comments array as normal post
        if (!comment.classList.contains('comment__box--reply')) {
            responseObject.comments.push(newComment);
        }
        // it's reply post, find post to which it's replied and insert them into their reply handle
        else {
            let lastPostID = lastRepliedPost.id;

            // find cached comment to which is replied with given ID and insert reply to them
            findCommentAndCacheReply(lastPostID, newComment);
        }
    }

    // find cached comment to which is replied with given ID and insert reply to them
    function findCommentAndCacheReply(id, replyComment) {

        var comments = responseObject.comments;

        for (let i = 0; i < comments.length; i++) {
            // if original post comment is found, then insert reply to them
            if (comments[i].id === id) {
                comments[i].reply.push(replyComment);
                break;
            }

            // try to search in reply array
            let replies = comments[i].reply;

            // search in depth using recursion
            searchDepth(replies, id, replyComment);
        }
    }

    // // search comments in depth using recursion 
    function searchDepth(replies, id, replyComment) {

        for (let j = 0; j < replies.length; j++) {
            // if original post comment is found, then insert reply to them
            if (replies[j].id === id) {
                replies[j].reply.push(replyComment);
                break;
            }

            let anotherReplies = replies[j].reply;

            // search more in depth
            searchDepth(anotherReplies, id, replyComment);
        }
    }


    // create comment structure
    function createComment(comment) {
        // get logged user info from server for creating comment
        var login = responseObject.login;

        var imageSize = 70;

        // create comments elements
        var box = document.createElement('div');
        var left = document.createElement('div');
        var imageLink = document.createElement('a');
        var image = document.createElement('img');
        var info = document.createElement('div');
        var header = document.createElement('p');
        var userLink = document.createElement('a');
        var text = document.createElement('p');
        var footer = document.createElement('p');
        var reply = document.createElement('a');
        var replyDot = document.createElement('span');
        var like = document.createElement('a');
        var likeDot = document.createElement('span');
        var personLink = document.createElement('a');
        var thumb = document.createElement('i');
        var count = document.createElement('span');
        var liked = document.createElement('span');
        var likedDot = document.createElement('span');
        var date = document.createElement('span');

        // add attributes

        // add unique ID for each comment
        box.id = 'comment-' + commentID++;

        box.classList.add('comment__box');
        left.classList.add('comment__left');
        imageLink.classList.add('comment__link');
        imageLink.href = login.link;
        image.classList.add('comment__image')
        image.alt = login.picture_info;
        image.src = login.picture;
        image.width = imageSize;
        image.height = imageSize;
        info.classList.add('comment__info');
        header.classList.add('comment__header');
        userLink.classList.add('comment__link', 'comment__user');
        userLink.href = login.link;
        userLink.textContent = login.name;
        text.classList.add('comment__text');
        text.textContent = comment;   // add comment as text to prevent XSS attack
        footer.classList.add('comment__footer');
        reply.classList.add('comment__link', 'comment__link--small', 'comment__reply-link');
        reply.href = login.link;
        reply.textContent = 'Reply';
        replyDot.classList.add('comment__dot');
        replyDot.innerHTML = '&bull;';  // set as HTML because of HTML entity
        like.classList.add('comment__link', 'comment__link--small', 'comment__like-link');
        like.href = login.link;
        like.textContent = 'Like';
        likeDot.classList.add('comment__dot');
        likeDot.innerHTML = '&bull;';
        personLink.classList.add('comment__link', 'comment__link--small', 'comment__person-link');
        personLink.href = login.link;
        thumb.classList.add('far', 'fa-thumbs-up', 'comment__like');
        count.classList.add('comment__count');
        count.textContent = '0';
        liked.classList.add('comment__liked');
        liked.textContent = ' liked this';
        likedDot.classList.add('comment__dot');
        likedDot.innerHTML = '&bull;';
        date.classList.add('comment__date');

        // get current date
        var currDate = new Date();
        var dateString = currDate.toLocaleDateString();
        var hours = currDate.getHours();
        var minutes = currDate.getMinutes();

        // if it's one digit, append with leading zero
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;

        // get date components by splitting tokens with /
        var dateStringTokens = dateString.split('/');
        var day = dateStringTokens[0];
        var month = dateStringTokens[1];
        var year = dateStringTokens[2];

        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;

        date.textContent = day + '-' + month + '-' + year + ' ' + hours + ':' + minutes;

        // form html
        box.append(left);
        left.append(imageLink);
        imageLink.append(image);
        box.append(info);
        info.append(header);
        header.append(userLink);
        header.append(document.createTextNode(' wrote...'));
        info.append(text);
        info.append(footer);
        footer.append(reply);
        footer.append(document.createTextNode('\n'));  // put text node between elements
        footer.append(replyDot);
        footer.append(document.createTextNode('\n'));
        footer.append(like);
        footer.append(document.createTextNode('\n'));
        footer.append(likeDot);
        footer.append(document.createTextNode('\n'));
        footer.append(personLink);
        personLink.append(thumb);
        personLink.append(document.createTextNode('\n'));
        personLink.append(count);
        personLink.append(document.createTextNode(' person '));
        footer.append(liked);
        footer.append(document.createTextNode('\n'));
        footer.append(likedDot);
        footer.append(document.createTextNode('\n'));
        footer.append(date);

        // add event listeners for new created comments for reply, like and person link
        reply.addEventListener('click', replyComment);
        like.addEventListener('click', likeComment);
        personLink.addEventListener('click', listPersons);

        return box;
    }


    // reply, like and person links
    var replies = document.getElementsByClassName('comment__reply-link');
    var likes = document.getElementsByClassName('comment__like-link');
    var persons = document.getElementsByClassName('comment__person-link');

    // add event listeners
    for (let i = 0; i < replies.length; i++) replies[i].addEventListener('click', replyComment);
    for (let i = 0; i < likes.length; i++) likes[i].addEventListener('click', likeComment);
    for (let i = 0; i < persons.length; i++) persons[i].addEventListener('click', listPersons);

    // last post to which is replied
    var lastRepliedPost;

    // reply on comment
    function replyComment(e) {
        e.preventDefault();

        var target = e.target;

        // update last replied post
        lastRepliedPost = target.parentElement.parentElement.parentElement;

        // check for errors if exits before moving the next content
        var errorMessage = input.nextElementSibling;

        // move comment input and controls bellow new comment
        // remove elements from DOM
        input.remove();
        controls.remove();

        // clear input with previous content
        input.value = '';

        // remove errors if exists from previous content
        if (errorMessage) {
            // if error is found, remove it from page
            if (errorMessage.classList.contains('comment__message')) {
                errorMessage.remove();
            }
        }

        // also remove error border if error occurs from previous content
        if (input.classList.contains('comment__input--error')) {
            input.classList.remove('comment__input--error');
        }

        // when reply is clicked, show controls
        if (!controls.classList.contains('show')) controls.classList.add('show');

        // insert elements in DOM bellow new comment
        var newComment = target.parentElement.parentElement.parentElement;
        newComment.after(input);
        input.after(controls);
    }

    // like comment
    function likeComment(e) {
        e.preventDefault();

        // get target, comment box, count for likes and like link from DOM
        var target = e.target;
        var comment = target.parentElement.parentElement.parentElement;
        var count = comment.getElementsByClassName('comment__count')[0];
        var likeLink = comment.getElementsByClassName('comment__like-link')[0];

        // ID for comment
        var id = comment.id;

        // find comment from cached comments
        var commentCache = findCommentById(id);
        var likeList = commentCache.likeList;
        var personList = likeList.persons;
        var personFound = false;

        // username for logged user
        var username = responseObject.login.name;
        var userLink = responseObject.login.link;

        // search in person list and if it is not already liked, like it
        for (let i = 0; i < personList.length; i++) {
            if (personList[i].name === username) {
                personFound = true;
                break;
            }
        }

        // person is not found in like list, increment number of likes, display on the page
        // and add logged user to the like list
        if (!personFound) {
            likeList.numberOfLikes++;

            // update number of likes on page also
            count.textContent = likeList.numberOfLikes;

            personList.push({
                name: username,
                link: userLink
            });

            // remove cursor pointer for link and change color of liked comment
            likeLink.classList.add('comment__like-link--already-liked');
        }
    }


    // find comment by ID from response object
    function findCommentById(id) {
        var comments = responseObject.comments;

        // search for comment with given ID
        return findCommentByIdRecursive(id, comments);
    }

    // search for comment with given ID for given array recursively
    function findCommentByIdRecursive(id, arrayObject) {

        for (let i = 0; i < arrayObject.length; i++) {
            if (arrayObject[i].id === id) {
                return arrayObject[i];
            }

            // search deeper in comment replies array
            let replies = arrayObject[i].reply;
            let comment = findCommentByIdRecursive(id, replies);

            // if comment is found in replies, return that comment
            if (comment) return comment;
        }
    }

    // show on page list of all persons who liked comment
    function listPersons(e) {
        e.preventDefault();

        var target = e.target;
        var personWrapper;
        var comment;

        if (target.classList.contains('comment__person-link')) {
            comment = target.parentElement.parentElement.parentElement.parentElement;
            personWrapper = target.parentElement;
        }
        else {
            comment = target.parentElement.parentElement.parentElement.parentElement.parentElement;
            personWrapper = target.parentElement.parentElement;
        }

        // if one page list is opened on page, then it must be removed before opening another
        // all page lists must be closed on page before opening new one
        var commentsContainer = document.getElementById('badge__wrapper--comments-id');
        let pageLists = commentsContainer.getElementsByClassName('comment__person-list');

        pageListsNumber = pageLists.length;

        // close all page lists from page
        if (pageListsNumber) {
            for (let i = 0; i < pageListsNumber; i++) pageLists[0].remove();
        }

        // find cached comment object
        var commentObject = findCommentById(comment.id);
        var personList;
        var personListClass = 'comment__person-list';

        // add person list to the page if it's not already there
        if (commentObject && !personWrapper.getElementsByClassName(personListClass)[0]) {
            personList = commentObject.likeList.persons;

            // person list container
            let personListContainer = document.createElement('div');

            personListContainer.classList.add(personListClass);

            // create link for each person and add to container
            personList.forEach(function iterate(value, index, array) {
                let personName = document.createElement('a');

                personName.classList.add('comment__person-name');
                personName.textContent = value.name;
                personName.href = value.link;
                personListContainer.append(personName);
            });

            // add person list container to the page if they are any persons
            if (personList.length) personWrapper.append(personListContainer);
        }
    }

    // close person lists from page if it's clicked out of person list or person link
    window.addEventListener('click', closePersonList);

    // close person lists from page
    function closePersonList(e) {
        var target = e.target;
        var commentsContainer = document.getElementById('badge__wrapper--comments-id');

        if (!target.classList.contains('comment__person-link') &&
            !target.classList.contains('comment__person-list') &&
            !target.classList.contains('comment__like') &&
            !target.classList.contains('comment__count') &&
            !target.classList.contains('class="comment__person-name')) {

            let list = commentsContainer.getElementsByClassName('comment__person-list');
            listNum = list.length;

            // remove all person lists from page
            if (listNum) {
                for (let i = 0; i < listNum; i++) list[0].remove();
            }
        }
    }
}