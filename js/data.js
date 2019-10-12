'use strict';

(function () {
  var ApartamentType = {
    FLAT: 'Квартира',
    BUNGALO: 'Бунгало',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };

  window.data = {
    ApartamentTypes: ApartamentType,
    Location: Location,

    /**
     * Генерирует и добавляет на карту пины и карточки офферов.
     *
     * @param {objects} announcements - Объект с офферами.
     */
    appendPinsAndCards: function (announcements) {
      var htmlPins = window.pin.generatePins(announcements);
      var htmlCards = window.card.generateCards(announcements);
      window.map.appendPins(htmlPins);
      window.map.appendCards(htmlCards);
      window.data.itemsNumber = announcements.length;
    }
  };
})();
