'use strict';

var APARTAMENT_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_AND_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var APARTAMENT_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var Locations = {
  Y_MIN: 130,
  Y_MAX: 630,
  X_MIN: 100,
  X_MAX: 1100
};
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var NUMBER_OF_ANNOUNCEMENTS = 8;

document.querySelector('.map').classList.remove('map--faded');

var map = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('button');

/**
 * Возвращает случайное число в диапазоне от min до max(не включая).
 *
 * @param {number} min - нижняя граница диапазона.
 * @param {number} max - верхняя граница диапазона.
 * @return {number} Случайное число.
 */
var getRandomNumberFromRange = function (min, max) {
  var result = Math.random() * (max - min) + min;
  return Math.floor(result);
};

/**
 * Возвращает случайное значение из массива.
 *
 * @param {array} arr - массив, из которого нужно получить значение.
 * @return {*} Случайное значение из массива.
 */
var getRandomValueFromArray = function (arr) {
  var valueIndex = getRandomNumberFromRange(0, arr.length);
  var value = arr[valueIndex];
  return value;
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

    var announcement = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        title: 'Объявление о продаже',
        price: 500,
        type: getRandomValueFromArray(APARTAMENT_TYPES),
        rooms: 4,
        guests: 5,
        checkin: getRandomValueFromArray(CHECKIN_AND_CHECKOUT_TIME),
        checkout: getRandomValueFromArray(CHECKIN_AND_CHECKOUT_TIME),
        features: FEATURES.slice(getRandomNumberFromRange(0, FEATURES.length)),
        description: 'Описание объявления',
        photos: APARTAMENT_PHOTOS.slice(getRandomNumberFromRange(0, APARTAMENT_PHOTOS.length))
      },
      location: {
        x: getRandomNumberFromRange(Locations.X_MIN, Locations.X_MAX),
        y: getRandomNumberFromRange(Locations.Y_MIN, Locations.Y_MAX)
      }
    };
    announcement.offer.address = announcement.location.x + ', ' + announcement.location.y;

    announcements.push(announcement);
  }
  return announcements;
};

/**
 * Генерирует массив с нодами пинов офферов.
 *
 * @param {array} announcements - Массив с объектами офферов.
 * @return {array} Массив с нодами пинов для карты.
 */
var renderPins = function (announcements) {
  var pins = [];

  announcements.forEach(function (item, index) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImg = pinElement.querySelector('img');

    var avatarUrl = announcements[index].author.avatar;
    pinImg.setAttribute('src', avatarUrl);

    var offerTitle = announcements[index].offer.title;
    pinImg.setAttribute('alt', offerTitle);

    var locationX = announcements[index].location.x + PIN_WIDTH / 2 + 'px';
    var locationY = announcements[index].location.y + PIN_HEIGHT + 'px';
    var pinCoordinates = 'left: ' + locationX + '; ' + 'top: ' + locationY + ';';
    pinElement.setAttribute('style', pinCoordinates);

    pins.push(pinElement);
  });
  return pins;
};

var appendPins = function (pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(pins[i]);
  }
  map.appendChild(fragment);
};

var announcements = generateAllAnnouncements(NUMBER_OF_ANNOUNCEMENTS);
var htmlPins = renderPins(announcements);
appendPins(htmlPins);
