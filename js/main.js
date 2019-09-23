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
        price: 1500,
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
  if (engApartamentType === 'flat') {
    return 'Квартира';
  } else if (engApartamentType === 'bungalo') {
    return 'Бунгало';
  } else if (engApartamentType === 'house') {
    return 'Дом';
  } else if (engApartamentType === 'palace') {
    return 'Дворец';
  } else {
    return engApartamentType;
  }
};

/**
 * Удаляет элементы массива deleteItemsArray из массива mainArray.
 *
 * @param {array} deleteItemsArray - Массив, элементы которого нужно найти в другом массиве и удалить.
 * @param {array} mainArray - Массив в котором удалются элементы.
 * @return {array} Массив с удаленными элементами.
 */
var getDiffArray = function (deleteItemsArray, mainArray) {
  deleteItemsArray.forEach(function (feature) {
    if (mainArray.includes(feature)) {
      var deleteItemIndex = mainArray.indexOf(feature);
      mainArray.splice(deleteItemIndex, 1);
    }
  });
  return mainArray;
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
  arrayWithDeleteFeatures.forEach(function (item) {
    var selector = '.popup__feature--' + item;
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

  offerImg.setAttribute('src', arrayWithPhotos[0]);

  if (arrayWithPhotos.length > 1) {
    for (var i = 1; i < arrayWithPhotos.length; i++) {
      var imgElement = offerImg.cloneNode(true);
      imgElement.setAttribute('src', arrayWithPhotos[i]);
      fragment.appendChild(imgElement);
    }
    offerImgWrapper.appendChild(fragment);
  }
};

/**
 * Добавляет карточки офферов в разметку.
 *
 * @param {array} announcementsArray - Массив с объектами офферов.
 */
var appendAnnouncements = function (announcementsArray) {
  var fragment = document.createDocumentFragment();

  announcementsArray.forEach(function (item) {
    var announcementElement = announcementTemplate.cloneNode(true);

    announcementElement.querySelector('.popup__title').textContent = item.offer.title;
    announcementElement.querySelector('.popup__text--address').textContent = item.offer.address;
    announcementElement.querySelector('.popup__text--price').innerHTML = item.offer.price + '&#8381;' + '/ночь';
    announcementElement.querySelector('.popup__type').textContent = getRusApartamentType(item.offer.type);
    announcementElement.querySelector('.popup__text--capacity').textContent = item.offer.rooms + ' комнаты для ' + item.offer.guests + ' гостей';
    announcementElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
    announcementElement.querySelector('.popup__description').textContent = item.offer.description;
    announcementElement.querySelector('.popup__avatar').setAttribute('src', item.author.avatar);

    editFeatures(announcementElement, getDiffArray(item.offer.features, FEATURES));
    addOfferPhotos(announcementElement, item.offer.photos);

    fragment.appendChild(announcementElement);
  });
  map.insertBefore(fragment, mapFiltersContainer);
};

var announcements = generateAllAnnouncements(NUMBER_OF_ANNOUNCEMENTS);
var htmlPins = renderPins(announcements);
appendPins(htmlPins);
appendAnnouncements(announcements);
