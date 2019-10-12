'use strict';

(function () {
  var OK_STATUS_CODE = 200;
  var REQUEST_TIMEOUT = 10000;
  var URL = {
    LOAD: 'https://js.dump.academy/keksobooking/data'
  };

  window.backend = {
    URL: URL,

    /**
     * Загружает данные с сервера.
     *
     * @param {string} url - Адрес сервера.
     * @param {function} onLoad - Функция для обработки полученных данных.
     * @param {function} onError - Функция для обработки ошибок при обращении к серверу.
     * @param {function} cb - Callback функция.
     */
    load: function (url, onLoad, onError, cb) {
      var xhr = initXHR(onLoad, onError, cb);
      xhr.open('GET', url);
      xhr.send();
    },

    /**
     * Функция, которая отображает ошибки при загрузке данных с сервера.
     *
     * @param {string} errorMessage - Текст ошибки.
     */
    errorHandler: function (errorMessage) {
      var template = document.querySelector('#error')
          .content
          .querySelector('div');
      var element = template.cloneNode(true);
      element.querySelector('.error__message').textContent = errorMessage;

      document.querySelector('main').appendChild(element);

      document.addEventListener('keydown', errorWindowKeydownHandler);
      element.addEventListener('click', errorWindowClickHandler);
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
  var initXHR = function (onLoad, onError, cb) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === OK_STATUS_CODE) {
        onLoad(xhr.response);
        cb();
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

  /**
   * Добавляет обработчик для закрытия окна с ошибкой
   * при нажатии на Esc.
   *
   * @param {object} evt - Объект события.
   */
  var errorWindowKeydownHandler = function (evt) {
    window.util.isEscEvent(evt, closeXhrErrorWindow);
  };

  /**
   * Добавляет обработчик для закрытия окна с ошибкой
   * при клике по произвольной области экрана
   * за пределами блока с сообщением.
   *
   * @param {object} evt - Объект события.
   */
  var errorWindowClickHandler = function (evt) {
    if (evt.target !== document.querySelector('.error__message')) {
      closeXhrErrorWindow();
    }
  };

  /**
   * Удаляет из DOM окно с ошибкой.
   */
  var closeXhrErrorWindow = function () {
    document.querySelector('.error').remove();
    document.removeEventListener('keydown', errorWindowKeydownHandler);
  };
})();
