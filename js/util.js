'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  window.util = {
    /**
     * Функция для обработки событий при нажатию на ESC.
     *
     * @param {object} evt - объект события
     * @param {function} action - фукнция, которую необходимо выполнить
     */
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

    /**
     * Функция для обработки событий при нажатию на ENTER.
     *
     * @param {object} evt - объект события
     * @param {function} action - фукнция, которую необходимо выполнить
     */
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    }
  };
})();
