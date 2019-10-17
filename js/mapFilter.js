'use strict';

(function () {
  /**
   * Слушает изменения фильторов карты и
   * отображает соответствующие пины.
   *
   * @param {object} evt - Объект события.
   */
  var mapFiltersHandler = function (evt) {
    var currentFilter = evt.target.getAttribute('name').split('-')[1];
    window.data.removePinsAndCards();
    window.data.appendPinsAndCards(window.data.allAnnouncements.filter(function (announcement) {
      if (evt.target.value === 'any') {
        return announcement;
      }
      return announcement.offer[currentFilter] === evt.target.value;
    }));
  };

  var filters = document.querySelector('.map__filters');
  filters.addEventListener('change', mapFiltersHandler);
})();
