'use strict';
(function () {
  var SIZE_STEP = 25;
  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_SYMBOLS = 20;
  var MIN_HASHTAG_SYMBOLS = 2;
  var SCALE_LINE_WIDTH = 450;
  var MAX_BLUR = 3;
  var SCALE_SIZE = '100%';

  var currentValue = 100;
  var effects = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
  var currentEffect = null;

  var image = document.querySelector('.img-upload__preview img');
  var minusButton = document.querySelector('.resize__control--minus');
  var plusButton = document.querySelector('.resize__control--plus');
  var sizeIndicator = document.querySelector('.resize__control--value');
  var imgUpload = document.querySelector('.img-upload__preview');
  var hashtagInput = document.querySelector('.text__hashtags');
  var scaleValue = document.querySelector('.scale__value');
  var scalePin = document.querySelector('.scale__pin');
  var scaleLevel = document.querySelector('.scale__level');
  var imgUploadScale = document.querySelector('.img-upload__scale');
  var form = document.querySelector('.img-upload__form');
  var editingBlock = document.querySelector('.img-upload__overlay');

  var resetForm = function () {
    form.reset();
    image.classList.remove('effects__preview--' + currentEffect);
    image.classList.add('effects__preview--none');
    image.style = '';
    imgUpload.style.transform = 'scale(1)';
  };

  var escCloseHandler = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      editingBlock.classList.add('hidden');
      resetForm();
      evt.preventDefault();
      return false;
    }
    return true;
  };

  var openAndCloseUploadBlock = function () {
    var uploadFileBlock = document.querySelector('#upload-file');
    var cancelButton = document.querySelector('#upload-cancel');
    uploadFileBlock.addEventListener('change', function () {
      editingBlock.classList.remove('hidden');
      imgUploadScale.classList.add('hidden');
      image.classList.add('effects__preview--none');
      image.style = '';
    });
    cancelButton.addEventListener('click', function () {
      editingBlock.classList.add('hidden');
      resetForm();
      editingBlock.removeEventListener('keydown', escCloseHandler);
    });
    uploadFileBlock.addEventListener('keydown', escCloseHandler);

  };

  var changeSize = function (size) {
    imgUpload.style.transform = 'scale(' + size + ')';
  };

  var createSizeButtonsActions = function () {
    plusButton.addEventListener('click', function () {
      currentValue = Math.min(currentValue + SIZE_STEP, 100);
      sizeIndicator.value = currentValue + '%';
      changeSize(currentValue / 100);
    });
    minusButton.addEventListener('click', function () {
      currentValue = Math.max(currentValue - SIZE_STEP, 25);
      sizeIndicator.value = currentValue + '%';
      changeSize(currentValue / 100);
    });
  };


  var makeHandler = function (effectName, originalImage) {
    return function () {
      imgUploadScale.classList.remove('hidden');
      scalePin.style.left = SCALE_SIZE;
      scaleLevel.style.width = SCALE_SIZE;
      originalImage.classList.remove('effects__preview--' + currentEffect);
      currentEffect = effectName;
      originalImage.classList.add('effects__preview--' + effectName);
      changeFilterSaturation(SCALE_LINE_WIDTH);
      if (effectName === 'none') {
        imgUploadScale.classList.add('hidden');
        image.style = '';
      }
    };
  };

  var applyEffect = function () {
    for (var i = 0; i < effects.length; i++) {
      var effectButton = document.querySelector('#effect-' + effects[i]);
      effectButton.addEventListener('click', makeHandler(effects[i], image));
    }
  };

  var checkFirstSymbol = function (word) {
    if (word[0] !== '#' && word !== '') {
      return 'Хэш-тег должен начинаться с символа "#"';
    }
    return '';
  };

  var checkHashtagSpace = function (word) {
    var symbolIndex = word.indexOf('#', 1);
    if (symbolIndex !== -1) {
      return 'Хэш-теги должны разделяться пробелом';
    }
    return '';
  };

  var checkHashtagLength = function (word) {
    if (word.length !== 0) {
      if (word.length > MAX_HASHTAG_SYMBOLS || word.length < MIN_HASHTAG_SYMBOLS) {
        return 'Длина хэш-тега не должна превышать 20 символов, хэш-тег не может содержать одиночную решетку';
      }
    }
    return '';
  };

  var validateHashTag = function (evt) {
    var hashtags = evt.target.value.toLowerCase().split(' ');
    var validity = (hashtags.length > MAX_HASHTAGS ? 'Количество хэш-тегов не может быть больше 5' : '');
    for (var i = 0; i < hashtags.length; i++) {
      var hashtag = hashtags[i];
      validity = validity || checkHashtagLength(hashtag) || checkHashtagSpace(hashtag) || checkFirstSymbol(hashtag);
      for (var j = i + 1; j < hashtag.length; j++) {
        var anotherHashTag = hashtags[j];
        validity = validity || (anotherHashTag === hashtag ? 'Присутствуют одинаковые хэш-теги' : '');
      }
      if (validity !== '') {
        break;
      }
    }
    evt.target.setCustomValidity(validity);
  };
  hashtagInput.addEventListener('change', validateHashTag);


  var onLoadDataToServer = function () {
    editingBlock.classList.add('hidden');
  };

  var onErrorDataToServer = function (string) {
    window.utils.drawErrorElement(string);
  };

  form.addEventListener('submit', function (evt) {
    window.backend.sendDataToServer(new FormData(form), onLoadDataToServer, onErrorDataToServer);
    resetForm();
    evt.preventDefault();
  });

  var movePin = function () {
    scalePin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX
      };

      var pinMouseMooveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX
        };

        startCoords = {
          x: moveEvt.clientX
        };

        scaleValue.value = selectAverageAmount(0, scalePin.offsetLeft - shift.x, SCALE_LINE_WIDTH);
        scalePin.style.left = scaleValue.value + 'px';
        scaleLevel.style.width = scaleValue.value + 'px';
        changeFilterSaturation(scalePin.offsetLeft - shift.x);

      };

      var pinMouseUpHandler = function (upEvt) {
        upEvt.preventDefault();


        document.removeEventListener('mousemove', pinMouseMooveHandler);
        document.removeEventListener('mouseup', pinMouseUpHandler);
      };

      document.addEventListener('mousemove', pinMouseMooveHandler);
      document.addEventListener('mouseup', pinMouseUpHandler);
    });
  };

  var changeFilterSaturation = function (currentCoords) {
    var originalImage = document.querySelector('.img-upload__preview img');
    var saturationDegree = currentCoords / SCALE_LINE_WIDTH;
    if (currentEffect === 'chrome') {
      originalImage.style.filter = 'grayscale(' + saturationDegree + ')';
    } if (currentEffect === 'sepia') {
      originalImage.style.filter = 'sepia(' + saturationDegree + ')';
    } if (currentEffect === 'marvin') {
      originalImage.style.filter = 'invert(' + saturationDegree * 100 + '%)';
    } if (currentEffect === 'phobos') {
      originalImage.style.filter = 'blur(' + saturationDegree * MAX_BLUR + 'px)';
    } if (currentEffect === 'heat') {
      var newSaturationDegree = 1 + 2 * saturationDegree;
      originalImage.style.filter = 'brightness(' + newSaturationDegree + ')';
    }
  };

  var selectAverageAmount = function (minParam, currentParam, maxParam) {
    if (currentParam < minParam) {
      return minParam;
    } if (currentParam > maxParam) {
      return maxParam;
    } else {
      return currentParam;
    }
  };

  openAndCloseUploadBlock();

  createSizeButtonsActions();
  applyEffect();
  movePin();
})();
