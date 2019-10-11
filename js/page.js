'use strict';

(function () {
  window.page = {
    active: false,

    /**
     * Делает страницу активной.
     *
     */
    makeActive: function () {
      if (!this.active) {
        this.active = true;

        window.map.makeActive();
        window.form.makeActive();
        window.data.generateAll();
        window.pin.addMousemoveHandler();
      }
    }
  };
})();
