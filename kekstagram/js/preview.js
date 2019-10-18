'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = document.querySelector('.big-picture__cancel');

  var hideBlocks = function () {
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.social__loadmore').classList.add('visually-hidden');
  };

  var escCloseHandler = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      bigPicture.classList.add('hidden');
      document.querySelector('body').classList.remove('modal-open');
      document.removeEventListener('keydown', escCloseHandler);
    }
  };

  var closeBigPictureBlock = function () {
    bigPictureClose.addEventListener('click', function () {
      bigPicture.classList.add('hidden');
      document.querySelector('body').classList.remove('modal-open');
      document.removeEventListener('keydown', escCloseHandler);
    });
    document.addEventListener('keydown', escCloseHandler);
  };

  var renderBigPicture = function (pictureObject) {
    bigPicture.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');
    document.querySelector('.big-picture__img img').src = pictureObject.url;
    document.querySelector('.likes-count').textContent = pictureObject.likes;
    document.querySelector('.comments-count').textContent = pictureObject.comments.length;
    window.data.renderCommentsArea(pictureObject);
    closeBigPictureBlock();
  };

  window.preview = {
    hideBlocks: hideBlocks,
    renderBigPicture: renderBigPicture
  };

  hideBlocks();
})();
