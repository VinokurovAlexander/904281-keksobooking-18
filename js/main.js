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
var ApartamentPriceRange = {
  MIN_PRICE: 0,
  MAX_PRICE: 1000000
};
var RoomsAndGuestsRange = {
  MIN_NUMBER: 1,
  MAX_NUMBER: 5
};

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('button');
var announcementTemplate = document.querySelector('#card')
    .content
    .querySelector('article');
var mapFiltersContainer = document.querySelector('.map__filters-container');

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
        price: getRandomNumberFromRange(ApartamentPriceRange.MIN_PRICE, ApartamentPriceRange.MAX_PRICE),
        type: getRandomValueFromArray(APARTAMENT_TYPES),
        rooms: getRandomNumberFromRange(RoomsAndGuestsRange.MIN_NUMBER, RoomsAndGuestsRange.MAX_NUMBER),
        guests: getRandomNumberFromRange(RoomsAndGuestsRange.MIN_NUMBER, RoomsAndGuestsRange.MAX_NUMBER),
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

  announcements.forEach(function (advert) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImg = pinElement.querySelector('img');

    var avatarUrl = advert.author.avatar;
    pinImg.setAttribute('src', avatarUrl);

    var offerTitle = advert.offer.title;
    pinImg.setAttribute('alt', offerTitle);

    var locationX = advert.location.x + PIN_WIDTH / 2 + 'px';
    var locationY = advert.location.y + PIN_HEIGHT + 'px';
    var pinCoordinates = 'left: ' + locationX + '; ' + 'top: ' + locationY + ';';
    pinElement.setAttribute('style', pinCoordinates);

    pins.push(pinElement);
  });
  return pins;
};

/**
 * Добавляет пины офферов на карту.
 *
 * @param {array} pins - Массив с нодами офферов.
 */
var appendPins = function (pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(pins[i]);
  }
  mapPins.appendChild(fragment);
};

/**
 * Возвращает название апартаментов на русском языке.
 *
 * @param {string} engApartamentType - Название апартаментов на англ. языке.
 * @return {string} Название апартаментов на русском языке.
 */
var getRusApartamentType = function (engApartamentType) {
  var apartamentType = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  return apartamentType[engApartamentType];
};

/**
 * Удаляет лишние удобства в карточке оффера.
 *
 * @param {object} elementTemplate - Шаблон карточки объявления.
 * @param {array} arrayWithDeleteFeatures - Массив в котором указаны названия удобств,
 * которые нужно удалить.
 */
var editFeatures = function (elementTemplate, arrayWithDeleteFeatures) {
  var featuresList = elementTemplate.querySelector('.popup__features');
  arrayWithDeleteFeatures.forEach(function (feature) {
    var selector = '.popup__feature--' + feature;
    var featureItem = featuresList.querySelector(selector);
    featuresList.removeChild(featureItem);
  });
};

/**
 * Добавляет фотографии апартаментов в карточку оффера.
 *
 * @param {object} elementTemplate - Шаблон карточки объявления.
 * @param {array} arrayWithPhotos - Массив с адресами фотографий.
 */
var addOfferPhotos = function (elementTemplate, arrayWithPhotos) {
  var offerImgWrapper = elementTemplate.querySelector('.popup__photos');
  var offerImg = offerImgWrapper.querySelector('.popup__photo');
  var fragment = document.createDocumentFragment();

  offerImgWrapper.removeChild(offerImg);

  arrayWithPhotos.forEach(function (photoUrl) {
    var imgElement = offerImg.cloneNode(true);
    imgElement.setAttribute('src', photoUrl);
    fragment.appendChild(imgElement);
  });
  offerImgWrapper.appendChild(fragment);
};

/**
 * Добавляет карточки офферов в разметку.
 *
 * @param {array} announcementsArray - Массив с объектами офферов.
 */
var appendAnnouncements = function (announcementsArray) {
  var fragment = document.createDocumentFragment();

  announcementsArray.forEach(function (advert) {
    var announcementElement = announcementTemplate.cloneNode(true);

    announcementElement.querySelector('.popup__title').textContent = advert.offer.title;
    announcementElement.querySelector('.popup__text--address').textContent = advert.offer.address;
    announcementElement.querySelector('.popup__text--price').textContent = advert.offer.price + ' ₽/ночь';
    announcementElement.querySelector('.popup__type').textContent = getRusApartamentType(advert.offer.type);
    announcementElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
    announcementElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
    announcementElement.querySelector('.popup__description').textContent = advert.offer.description;
    announcementElement.querySelector('.popup__avatar').setAttribute('src', advert.author.avatar);

    var deleteFeatures = FEATURES.filter(function (feature) {
      return !advert.offer.features.includes(feature);
    });
    editFeatures(announcementElement, deleteFeatures);
    addOfferPhotos(announcementElement, advert.offer.photos);

    fragment.appendChild(announcementElement);
  });
  map.insertBefore(fragment, mapFiltersContainer);
};

var announcements = generateAllAnnouncements(NUMBER_OF_ANNOUNCEMENTS);
var htmlPins = renderPins(announcements);
appendPins(htmlPins);
appendAnnouncements(announcements);
