'use strict';

(function () {
  var mapPinsWrapper = document.querySelector('.map__pins');
  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mainMapPin = map.querySelector('.map__pin--main');

  window.map = {
    mapSection: map,
    mainMapPin: mainMapPin,

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
    var adverts = window.map.mapSection.querySelectorAll('.popup');
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
    var advertsCloseBtn = window.map.mapSection.querySelectorAll('.popup__close');
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
   *
   * @param {string} str - Строка из которой нужно получить число.
   * @return {number} - Порядковый номер.
   */
  var getPinIndex = function (str) {
    return str.match(/\d+/)[0].slice(1);
  };

  mainMapPin.addEventListener('mousedown', function () {
    window.form.makeFormActive();
  });
  mainMapPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, window.form.makeFormActive);
  });


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
