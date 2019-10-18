'use strict';
(function () {
  var NEW_PHOTOS_AMOUNT = 10;
  var DEBOUNCE_INTERVAL = 500;

  var photos = [];
  var currentButton = null;
  var picturesBlock = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');
  var imgFilters = document.querySelector('.img-filters');
  var fragment = document.createDocumentFragment();

  var FilterButtons = {
    popular: document.querySelector('#filter-popular'),
    new: document.querySelector('#filter-new'),
    discussed: document.querySelector('#filter-discussed')
  };

  window.picture = {
    arrayOfPictures: []
  };

  var drawPhotos = function (elem) {
    elem.forEach(function (element) {
      fragment.appendChild(renderPicture(element));
    });
    picturesBlock.appendChild(fragment);
  };

  var removePhotos = function () {
    picturesBlock.querySelectorAll('.picture__link').forEach(function (element) {
      picturesBlock.removeChild(element);
    });
  };

  var onLoadServerDataHandler = function (object) {
    photos = object.slice(0, object.length);
    drawPhotos(object);
    imgFilters.classList.remove('img-filters--inactive');
    currentButton = FilterButtons.popular;
  };

  var onErrorServerDataHandler = function (object) {
    window.picture.arrayOfPictures = [];
    window.utils.drawErrorElement(object);
  };

  var changeClass = function (buttonName) {
    currentButton.classList.remove('img-filters__button--active');
    currentButton = buttonName;
    currentButton.classList.add('img-filters__button--active');
  };

  var popularButtonClickHandler = function () {
    changeClass(FilterButtons.popular);
    setTimeout(function () {
      removePhotos();
      drawPhotos(photos);
    }, DEBOUNCE_INTERVAL);
  };

  var mixArray = function () {
    return Math.random() - 0.5;
  };

  var newButtonClickHandler = function () {
    changeClass(FilterButtons.new);
    setTimeout(function () {
      removePhotos();
      var copysOfPhotos = photos.slice(0, photos.length);
      copysOfPhotos.sort(mixArray);
      var newPhotos = copysOfPhotos.splice(0, NEW_PHOTOS_AMOUNT);
      drawPhotos(newPhotos);
    }, DEBOUNCE_INTERVAL);
  };

  var discussedButtonClickHandler = function () {
    changeClass(FilterButtons.discussed);
    setTimeout(function () {
      removePhotos();
      var copysOfPhotos = photos.slice(0, photos.length);
      copysOfPhotos.sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
      drawPhotos(copysOfPhotos);
    }, DEBOUNCE_INTERVAL);
  };

  FilterButtons.popular.addEventListener('click', function () {
    popularButtonClickHandler();
  });

  FilterButtons.new.addEventListener('click', function () {
    newButtonClickHandler();
  });

  FilterButtons.discussed.addEventListener('click', function () {
    discussedButtonClickHandler();
  });

  var renderPicture = function (pictureObject) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = pictureObject.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = pictureObject.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = pictureObject.comments.length;
    pictureElement.addEventListener('click', function () {
      window.preview.renderBigPicture(pictureObject);
    });
    return pictureElement;
  };

  window.backend.getDataFromServer(onLoadServerDataHandler, onErrorServerDataHandler);
})();
