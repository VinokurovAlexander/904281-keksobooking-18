'use strict';

(function () {
  var NUMBER_REGEX = /\d+/;
  var Location = {
    X: {
      MIN: 0,
      MAX: getMaxLocationX(document.querySelector('.map__overlay'))
    },

    Y: {
      MIN: 60,
      MAX: 560
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
   * @param {number} itemNumber - порядковый номер карточки.
   */
  var openAd = function (itemNumber) {
    var adverts = map.querySelectorAll('.popup');
    adverts[itemNumber - 1].classList.remove('popup--closed');
    addCloseAdvertsClickHandler();
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
   * Функция возвращает порядковый номер из адреса
   * пути к аватару (img/avatars/user04.png).
   * В случае последнего пина, у которого адрес img/avatars/default.png,
   * берется соответствующий последний порядковый номер в массиве офферов.
   *
   * @param {string} str - Строка из которой нужно получить число.
   * @return {number} - Порядковый номер.
   */
  var getPinIndex = function (str) {
    var result = str.match(NUMBER_REGEX);
    return result === null ? window.data.itemsNumber : result[0].slice(1);
  };

  /**
   * Возвращает максимальную координату размещения пина по оси Х.
   *
   * @param {object} element - Нода элемента в рамках которого перемещается пин.
   * @return {number} Максимальная координата размещения пина по оси Х.
   */
  function getMaxLocationX(element) {
    return element.clientWidth - window.pin.main.WIDTH;
  }

  map.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, closeAd);
  });

  map.addEventListener('click', function (evt) {
    if (evt.target.className === 'map__pin-image') {
      closeAd();
      openAd(getPinIndex(evt.target.getAttribute('src')));
    }
  });
})();
