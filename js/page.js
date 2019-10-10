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
        window.map.makeActive();
        window.form.makeActive();
        window.data.generateAll();

        this.active = true;

        window.pin.addMainPinMousemoveHandler();
      }
    }
  };
})();
