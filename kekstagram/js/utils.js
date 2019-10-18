'use strict';
(function () {
  var ESC_KEYCODE = 27;

  var drawErrorElement = function (error) {
    var imgUpload = document.querySelector('.img-upload');
    var fragment = document.createDocumentFragment();
    var errorText = document.createElement('p');
    errorText.textContent = error;
    fragment.appendChild(errorText);
    imgUpload.appendChild(fragment);
    errorText.style.width = '100';
    errorText.style.height = '40';
    errorText.style.background = 'white';
    errorText.zIndex = '1000';
  };

  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    drawErrorElement: drawErrorElement,
  };
})();
