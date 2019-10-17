'use strict';

(function () {

  window.page = {
    active: false,

    /**
     * Делает страницу активной.
     *
     * @param {objects} data - Данные для генерации пинов и карточек.
     */
    makeActive: function (data) {
      if (!window.page.active) {
        window.data.safeAnnouncements(data);
        window.data.appendPinsAndCards(data);
        activate(true);
      }
    },

    /**
     * Делает страницу неактивной.
     */
    makeInactive: function () {
      if (window.page.active) {
        window.data.removePinsAndCards();
        activate(false);
        window.pin.main.backToStart();
      }
    }
  };

  /**
   * Вспомогательная функция для активации страницы.
   *
   * @param {boolean} makeActive - Флаг.
   */
  var activate = function (makeActive) {
    window.page.active = makeActive;
    window.map.makeActive(makeActive);
    window.form.makeActive(makeActive);
    window.pin.main.addMousemoveHandler(makeActive);
  };
})();
