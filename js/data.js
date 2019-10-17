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
     * @param {object} announcements - Объект с офферами.
     */
    appendPinsAndCards: function (announcements) {
      window.data.allItemsNumber = announcements.length;
      var sliceAnnouncements = announcements.slice(0, window.mapFilter.ITEMS_ON_MAP_NUMBER);
      var htmlPins = window.pin.generatePins(sliceAnnouncements);
      var htmlCards = window.card.generateCards(sliceAnnouncements);
      window.map.appendPins(htmlPins);
      window.map.appendCards(htmlCards);
    },

    /**
     * Удаляет пины и карточки из разметки.
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
    },

    /**
     * Сохраняет все офферы.
     *
     * @param {object} announcements - Объект с офферами.
     */
    safeAnnouncements: function (announcements) {
      window.data.allAnnouncements = announcements;
    }
  };
})();
