'use strict';

(function () {
  var OK_STATUS_CODE = 200;
  var REQUEST_TIMEOUT = 10000;
  var URL = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    SAVE: 'https://js.dump.academy/keksobooking'
  };

  window.backend = {
    URL: URL,

    /**
     * Загружает данные с сервера.
     *
     * @param {string} url - Адрес сервера.
     * @param {function} onLoad - Функция для обработки полученных данных.
     * @param {function} onError - Функция для обработки ошибок при обращении к серверу.
     */
    load: function (url, onLoad, onError) {
      var xhr = initXHR(onLoad, onError);
      xhr.open('GET', url);
      xhr.send();
    },

    /**
     * Отправляет данные на сервер.
     *
     * @param {string} url - Адрес сервера.
     * @param {function} onLoad - Функция для обработки полученных данных.
     * @param {function} onError - Функция для обработки ошибок при обращении к серверу.
     * @param {object} data - Объект с данными, которые нужно отправить.
     */
    save: function (url, onLoad, onError, data) {
      var xhr = initXHR(onLoad, onError);
      xhr.open('POST', url);
      xhr.send(data);
    }
  };

  /**
   * Функция, для инициализации XHR.
   *
   * @param {function} onLoad - Функция для обработки полученных данных.
   * @param {function} onError - Функция для обработки ошибок при обращении к серверу.
   * @param {function} cb - Callback функция.
   * @return {object} Объект XHR.
   */
  var initXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === OK_STATUS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = REQUEST_TIMEOUT;

    return xhr;
  };
})();
