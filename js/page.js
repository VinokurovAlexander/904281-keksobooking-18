'use strict';

(function () {
  var pageActive = false;

  window.page = {
    /**
     * Делает страницу активной.
     */
    makeActive: function () {
      if (!pageActive) {
        pageActive = true;

        window.map.makeActive();
        window.form.makeActive();
        window.pin.addMousemoveHandler();
      }
    }
  };
})();
