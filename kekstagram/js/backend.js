'use strict';
(function () {
  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.img-upload__message--error');

  var imgUploadPreview = document.querySelector('.img-upload__preview');

  var getDataFromServer = function (onLoad, onError) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.open('GET', 'https://js.dump.academy/kekstagram/data');
      xhr.addEventListener('load', function () {
        var error;
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          case 400:
            error = 'Неверный запрос';
            break;
          case 404:
            error = 'Данные не найдены';
            break;
          case 500:
            error = 'Ошибка сервера';
            break;
          default:
            error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
        }
        if (error) {
          onError(error);
        }
      });
      xhr.send();
    } catch (error) {
      onError('Невозможно отправить запрос, отсутствует соединение');
    }
  };

  var drawErrorMessage = function () {
    var errorMessage = pictureTemplate.cloneNode(true);
    errorMessage.classList.remove('hidden');
    var fragment = document.createDocumentFragment();
    fragment.appendChild(errorMessage);
    imgUploadPreview.appendChild(fragment);
  };

  var sendDataToServer = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
        drawErrorMessage();
      }
    });
    xhr.open('POST', 'https://js.dump.academy/kekstagram');
    xhr.send(data);
  };

  window.backend = {
    getDataFromServer: getDataFromServer,
    sendDataToServer: sendDataToServer
  };
})();
