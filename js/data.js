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
    },

    /**
     * Удаляет пины и карточки из разметки.
     *
     */
    removePinsAndCards: function () {
      var objectElements = {
        pins: document.querySelectorAll('.map__pin'),
        cards: document.querySelectorAll('.map__card')
      };

      for (var elements in objectElements) {
        if (objectElements.hasOwnProperty(elements)) {
          objectElements[elements].forEach(function (element) {
            if (element.className === 'map__pin' || element.className.includes('map__card')) {
              element.remove();
            }
          });
        }
      }
    }
  };
})();
