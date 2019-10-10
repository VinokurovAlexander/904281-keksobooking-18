'use strict';

(function () {
  var ApartamentTypes = {
    FLAT: 'Квартира',
    BUNGALO: 'Бунгало',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };
  var ApartamentPriceRange = {
    MIN_PRICE: 0,
    MAX_PRICE: 1000000
  };
  var ROOMS = ['1 комната', '2 комнаты', '3 комнаты', '100 комнат'];
  var GUESTS = ['для 3 гостей', 'для 2 гостей', 'для 1 гостя', 'не для гостей'];
  var CHECKIN_AND_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var APARTAMENT_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var Locations = {
    Y_MIN: 130,
    Y_MAX: 560,
    X_MIN: 100,
    X_MAX: 1100
  };
  var NUMBER_OF_ANNOUNCEMENTS = 8;

  window.data = {
    ApartamentTypes: ApartamentTypes,
    FEATURES: FEATURES,
    Locations: Locations,

    /**
     * Генерирует и добавляет на карту пины и карточки офферов.
     *
     */
    generateAll: function () {
      var announcements = generateAllAnnouncements(NUMBER_OF_ANNOUNCEMENTS);
      var htmlPins = window.pin.generatePins(announcements);
      var htmlCards = window.card.generateCards(announcements);

      window.map.appendPins(htmlPins);
      window.map.appendCards(htmlCards);
    }
  };

  /**
   * Генерирует массив с объектами офферов.
   *
   * @param {number} numberOfAnnouncements - Количество генерируемых офферов.
   * @return {array} Массив с объектами офферов.
   */
  var generateAllAnnouncements = function (numberOfAnnouncements) {
    var announcements = [];

    for (var i = 1; i <= numberOfAnnouncements; i++) {
      var announcement = generateAnnouncement(i);
      announcements.push(announcement);
    }
    return announcements;
  };

  /**
   * Генерирует объект оффера.
   *
   * @param {number} index - Порядковый номер оффера.
   * @return {object} Массив с объектот оффера.
   */
  var generateAnnouncement = function (index) {
    var announcement = {
      author: {
        avatar: 'img/avatars/user0' + index + '.png'
      },
      offer: {
        title: 'Объявление о продаже',
        price: window.util.getRandomNumberFromRange(ApartamentPriceRange.MIN_PRICE, ApartamentPriceRange.MAX_PRICE),
        type: window.util.getRandomValueFromArray(Object.keys(ApartamentTypes)),
        rooms: window.util.getRandomValueFromArray(ROOMS),
        guests: window.util.getRandomValueFromArray(GUESTS),
        checkin: window.util.getRandomValueFromArray(CHECKIN_AND_CHECKOUT_TIME),
        checkout: window.util.getRandomValueFromArray(CHECKIN_AND_CHECKOUT_TIME),
        features: FEATURES.slice(window.util.getRandomNumberFromRange(0, FEATURES.length)),
        description: 'Описание объявления',
        photos: APARTAMENT_PHOTOS.slice(window.util.getRandomNumberFromRange(0, APARTAMENT_PHOTOS.length))
      },
      location: {
        x: window.util.getRandomNumberFromRange(Locations.X_MIN, Locations.X_MAX),
        y: window.util.getRandomNumberFromRange(Locations.Y_MIN, Locations.Y_MAX)
      }
    };
    announcement.offer.address = announcement.location.x + ', ' + announcement.location.y;

    return announcement;
  };
})();
