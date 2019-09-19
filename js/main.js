'use strict';

document.querySelector('.map').classList.remove('map--faded');

var map = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('button');

var APARTAMENT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_AND_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var APARTAMENT_PHOTO = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var LOCATION_X_MIN = 100;
var LOCATION_X_MAX = 1100;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var getRandomIndex = function (maxValue) {
  var randomIndex = Math.floor(Math.random() * maxValue);
  return randomIndex;
};

var getRandomValue = function (arr) {
  var valueIndex = getRandomIndex(arr.length);
  var value = arr[valueIndex];
  return value;
};

var getArrayWithRandomLenght = function (arr) {
  var result = [];
  var arrayLength = getRandomIndex(arr.length);

  for (var i = 0; i < arrayLength; i++) {
    result.push(arr[i]);
  }
  return result;
};

var getRandomValueFromRange = function (min, max) {
  var result = Math.random() * (max - min) + min;
  return Math.floor(result);
};

var generateAnnouncement = function (nummberOfAnnouncement) {
  var announcement = {
    author: {
      avatar: null
    },
    offer: {
      title: 'Объявление о продаже',
      address: '600, 350',
      price: 500,
      type: null,
      rooms: 4,
      guests: 5,
      checkin: null,
      checkout: null,
      features: null,
      description: 'Описание объявления',
      photos: null
    },
    location: {
      x: null,
      y: null
    }
  };

  announcement.author.avatar = 'img/avatars/user0' + nummberOfAnnouncement + '.png';

  announcement.offer.type = getRandomValue(APARTAMENT_TYPE);
  announcement.offer.checkin = getRandomValue(CHECKIN_AND_CHECKOUT_TIME);
  announcement.offer.checkout = getRandomValue(CHECKIN_AND_CHECKOUT_TIME);
  announcement.offer.features = getArrayWithRandomLenght(FEATURES);
  announcement.offer.photos = getArrayWithRandomLenght(APARTAMENT_PHOTO);

  announcement.location.x = getRandomValueFromRange(LOCATION_X_MIN, LOCATION_X_MAX);
  announcement.location.y = getRandomValueFromRange(LOCATION_Y_MIN, LOCATION_Y_MAX);

  return announcement;
};

var generateAllAnnouncements = function (nummberOfAnnouncements) {
  var announcements = [];

  for (var i = 1; i <= nummberOfAnnouncements; i++) {
    announcements.push(generateAnnouncement(i));
  }
  return announcements;
};

var renderPins = function (announcements) {
  var pins = [];

  for (var i = 0; i < announcements.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);

    var avatarUrl = announcements[i].author.avatar;
    pinElement.querySelector('img').setAttribute('src', avatarUrl);

    var offerTitle = announcements[i].offer.title;
    pinElement.querySelector('img').setAttribute('alt', offerTitle);

    var locationX = announcements[i].location.x + PIN_WIDTH / 2 + 'px';
    var locationY = announcements[i].location.y + PIN_HEIGHT + 'px';
    var pinCoordinates = 'left: ' + locationX + '; ' + 'top: ' + locationY + ';';
    pinElement.setAttribute('style', pinCoordinates);

    pins.push(pinElement);
  }
  return pins;
};

var appendPins = function (pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(pins[i]);
  }
  map.appendChild(fragment);
};

var announcements = generateAllAnnouncements(8);
var pins = renderPins(announcements);
appendPins(pins);
