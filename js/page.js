'use strict';

(function () {
  // var pageActive = false;

  window.page = {
    active: false,

    /**
     * Делает страницу активной.
     *
     * @param {objects} data - Данные для генерации пинов и карточек.
     */
    makeActive: function (data) {
      if (!window.page.active) {
        window.data.appendPinsAndCards(data);
        window.page.active = true;
        window.map.makeActive();
        window.form.makeActive();
        window.pin.addMousemoveHandler();
      }
    }
  };
})();
