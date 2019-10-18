'use strict';
(function () {
  var COMMENT_IMG_SIZE = 35;

  var getRandomIndex = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getCommentImg = function () {
    var commentImg = document.createElement('img');
    commentImg.classList.add('social__picture');
    commentImg.src = 'img/avatar-' + getRandomIndex(1, 7) + '.svg';
    commentImg.alt = 'Аватар комментатора фото';
    commentImg.width = COMMENT_IMG_SIZE;
    commentImg.height = COMMENT_IMG_SIZE;
    return commentImg;
  };

  var getCommentText = function (text) {
    var commentText = document.createElement('p');
    commentText.classList.add('social__text');
    commentText.textContent = text;
    return commentText;
  };

  var renderCommentsArea = function (pictureObject) {
    var commentsArea = document.querySelector('.social__comments');
    commentsArea.innerHTML = '';
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pictureObject.comments.length; i++) {
      var commentItem = document.createElement('li');
      commentItem.classList.add('social__comment', 'social__comment--text');
      commentItem.appendChild(getCommentImg());
      commentItem.appendChild(getCommentText(pictureObject.comments[i]));
      fragment.appendChild(commentItem);
      commentsArea.appendChild(fragment);
    }
  };

  window.data = {
    getRandomIndex: getRandomIndex,
    renderCommentsArea: renderCommentsArea
  };
})();
