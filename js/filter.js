'use strict';

(function () {
  var Price = {
    LOW: 10000,
    HIGH: 50000
  };
  var input = {
    type: document.querySelector('#housing-type'),
    price: document.querySelector('#housing-price'),
    rooms: document.querySelector('#housing-rooms'),
    guests: document.querySelector('#housing-guests')
  };

  var apply = {
    /**
     * Возвращает условие для применения фильтров на карте.
     *
     * @param {string} filterName - Название фильтра.
     * @param {objects} announcement - Объект оффера.
     * @return {boolean} Возвращает условие, которое подставляется
     * в метод filter для применения фильтров.
     */
    mapFilter: function (filterName, announcement) {
      if (filterName === 'price') {
        var priceRange = {
          low: function () {
            return announcement.offer.price < Price.LOW;
          },

          middle: function () {
            return announcement.offer.price >= Price.LOW && announcement.offer.price <= Price.HIGH;
          },

          high: function () {
            return announcement.offer.price > Price.HIGH;
          }
        };

        if (input.price.value === 'any') {
          return true;
        }

        return priceRange[input.price.value](announcement);
      }

      if (input[filterName].value === 'any') {
        return true;
      }
      return String(announcement.offer[filterName]) === input[filterName].value;
    },

    /**
     * Возвращает условие для применения фильтров по преимуществам.
     *
     * @param {string} filterName - Название фильтра.
     * @param {objects} announcement - Объект оффера.
     * @param {boolean} isChecked - Установлен данный фильтр или нет.
     * @return {boolean} Возвращает условие, которое подставляется
     * в метод filter для применения фильтров.
     */
    featuresFilter: function (filterName, announcement, isChecked) {
      return isChecked ? announcement.offer.features.includes(filterName) : true;
    }
  };

  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFilters = mapFiltersForm.querySelectorAll('select');
  var featuresNodeList = mapFiltersForm.querySelectorAll('input');

  /**
   * Возвращает массив, состоящий из объектов вида 'название фильтра': 'значение фильтра'
   *
   * @return {array} Массив, состоящий из объектов вида 'название фильтра': 'значение фильтра'
   */
  var getFilters = function () {
    var filters = Array.from(mapFilters).map(function (filter) {
      var filterObj = {};
      var filterType = filter.getAttribute('name').split('-')[1];
      filterObj[filterType] = filter.value;
      return filterObj;
    });

    var inputs = Array.from(featuresNodeList).map(function (inputFeature) {
      var featuresObj = {};
      featuresObj[inputFeature.value] = inputFeature.checked;
      return featuresObj;
    });

    return (filters.concat(inputs));
  };

  /**
   * Слушает изменения фильтров карты и отображает соответствующие пины.
   */
  var mapFiltersHandler = window.debounce(function () {
    var currentAnnouncements = window.data.allAnnouncements;
    var currentFilters = getFilters();

    currentFilters.forEach(function (filter) {
      var filterName = String(Object.keys(filter));

      currentAnnouncements = currentAnnouncements.filter(function (announcement) {
        if (window.card.FEATURES.includes(filterName)) {
          return apply.featuresFilter(filterName, announcement, filter[filterName]);
        }
        return apply.mapFilter(filterName, announcement);
      });

    });
    window.data.removePinsAndCards();
    window.data.appendPinsAndCards(currentAnnouncements);
  });

  mapFiltersForm.addEventListener('change', mapFiltersHandler);
})();
