'use strict';

(function () {
  var Location = {
    X: {
      MIN: -(Math.round(window.pin.main.WIDTH / 2)),
      MAX: getMaxLocationX(document.querySelector('.map__overlay'))
    },

    Y: {
      MIN: 65,
      MAX: 565
    }
  };

  var mapPinsWrapper = document.querySelector('.map__pins');
  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  window.map = {
    Location: Location,
    section: map,

    /**
     * Меняет активность карты.
     *
     * @param {boolean} makeActive - Флаг.
     */
    makeActive: function (makeActive) {
      if (makeActive) {
        map.classList.remove('map--faded');
      } else {
        map.classList.add('map--faded');
      }
    },

    /**
     * Добавляет пины офферов на карту.
     *
     * @param {array} pins - Массив с нодами офферов.
     */
    appendPins: function (pins) {
      var fragment = document.createDocumentFragment();

      pins.forEach(function (pin) {
        fragment.appendChild(pin);
      });
      mapPinsWrapper.appendChild(fragment);
    },

    /**
     * Добавляет карточки офферов в разметку.
     *
     * @param {array} cards - Массив с объектами карточек офферов.
     */
    appendCards: function (cards) {
      var fragment = document.createDocumentFragment();

      cards.forEach(function (card) {
        fragment.appendChild(card);
      });
      map.insertBefore(fragment, mapFiltersContainer);
    }
  };

  /**
   * Открывает карточку с объявлением.
   *
   * @param {object} evt - Объект события.
   */
  var openAd = function (evt) {
    var className = '';
    if (evt.target.className === 'map__pin-image') {
      className = '.map__pin img';
    } else if (evt.target.className === 'map__pin') {
      className = '.map__pin';
    }

    if (className !== '') {
      var cards = map.querySelectorAll('.popup');
      var targetsArray = Array.from(map.querySelectorAll(className)).splice(1);
      var pinIndex = targetsArray.indexOf(evt.target);
      cards[pinIndex].classList.remove('popup--closed');
      addCloseAdvertsClickHandler();
    }
  };

  /**
   * Закрывает карточку с объявлением.
   */
  var closeAd = function () {
    var adverts = window.map.section.querySelectorAll('.popup');
    adverts.forEach(function (advert) {
      if (!advert.classList.contains('popup--closed')) {
        advert.classList.add('popup--closed');
      }
    });
  };

  /**
   * Добавляет обработчики на кнопки закрытия карточек с объявлениями.
   */
  var addCloseAdvertsClickHandler = function () {
    var advertsCloseBtn = window.map.section.querySelectorAll('.popup__close');
    advertsCloseBtn.forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeAd();
        btn.removeEventListener('keydown', window.util.isEscEvent);
      });
    });
  };

  /**
   * Возвращает максимальную координату размещения пина по оси Х.
   *
   * @param {object} element - Нода элемента в рамках которого перемещается пин.
   * @return {number} Максимальная координата размещения пина по оси Х.
   */
  function getMaxLocationX(element) {
    return element.clientWidth - (window.pin.main.WIDTH / 2);
  }

  /**
   * Функция закрывает открытую карточку объявления
   * и открывает новую.
   *
   * @param {object} evt - Объект события.
   */
  var openAdHandler = function (evt) {
    closeAd();
    openAd(evt);
  };

  map.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, closeAd);
  });

  map.addEventListener('click', openAdHandler);

  map.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, function () {
      openAdHandler(evt);
    });
  });

})();
