'use strict';

(function () {
  var template = document.querySelector('#success')
    .content
    .querySelector('div');

  window.success = {
    show: function () {
      var element = template.cloneNode(true);

      document.querySelector('main').appendChild(element);

      document.addEventListener('click', closeWindowСlickHandler);
      document.addEventListener('keydown', closeWindowKeydownHandler);
    }
  };

  /**
   * Удаляет из DOM окно.
   */
  var closeWindow = function () {
    document.querySelector('.success').remove();
    document.removeEventListener('click', closeWindowСlickHandler);
    document.removeEventListener('keydown', closeWindowKeydownHandler);
  };

  /**
   * Обработчик для закрытия окна на событие click.
   */
  var closeWindowСlickHandler = function () {
    closeWindow();
  };

  /**
   * Обработчик для закртыия окна при нажатии на Esc.
   *
   * @param {object} evt - Объект события.
   */
  var closeWindowKeydownHandler = function (evt) {
    window.util.isEscEvent(evt, closeWindow);
  };
})();
