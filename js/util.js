'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  window.util = {
    /**
     * Возвращает случайное число в диапазоне от min до max(не включая).
     *
     * @param {number} min - нижняя граница диапазона.
     * @param {number} max - верхняя граница диапазона.
     * @return {number} Случайное число.
     */
    getRandomNumberFromRange: function (min, max) {
      var result = Math.random() * (max - min) + min;
      return Math.floor(result);
    },

    /**
     * Возвращает случайное значение из массива.
     *
     * @param {array} arr - массив, из которого нужно получить значение.
     * @return {*} Случайное значение из массива.
     */
    getRandomValueFromArray: function (arr) {
      var valueIndex = this.getRandomNumberFromRange(0, arr.length);
      var value = arr[valueIndex];
      return value;
    },

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
