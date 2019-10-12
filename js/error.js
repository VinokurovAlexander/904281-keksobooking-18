'use strict';

(function () {
  var template = document.querySelector('#error')
      .content
      .querySelector('div');

  window.error = {
    /**
     * Функция, которая отображает окно с ошибкой.
     *
     * @param {string} errorMessage - Текст ошибки.
     */
    handler: function (errorMessage) {
      var element = template.cloneNode(true);
      element.querySelector('.error__message').textContent = errorMessage;

      document.querySelector('main').appendChild(element);

      document.addEventListener('keydown', errorWindowKeydownHandler);
      element.addEventListener('click', errorWindowClickHandler);
    }
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
