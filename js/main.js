'use strict';

var APARTAMENT_TYPES = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};
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
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var NUMBER_OF_ANNOUNCEMENTS = 8;
var ApartamentPriceRange = {
  MIN_PRICE: 0,
  MAX_PRICE: 1000000
};
var ROOMS = ['1 комната', '2 комнаты', '3 комнаты', '100 комнат'];
var GUESTS = ['для 3 гостей', 'для 2 гостей', 'для 1 гостя', 'не для гостей'];
var ENTER_KEYCODE = 13;

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('button');
var announcementTemplate = document.querySelector('#card')
    .content
    .querySelector('article');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mainMapPin = map.querySelector('.map__pin--main');
var form = document.querySelector('.ad-form');
var Page = {
  active: false
};
var submitFormBtn = form.querySelector('.ad-form__submit');

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
        type: getRandomValueFromArray(Object.keys(APARTAMENT_TYPES)),
        rooms: getRandomValueFromArray(ROOMS),
        guests: getRandomValueFromArray(GUESTS),
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
    announcementElement.querySelector('.popup__type').textContent = APARTAMENT_TYPES[advert.offer.type];
    announcementElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' ' + advert.offer.guests;
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

/**
 * Изменяет активность полей формы подачи объявления
 * и формы с фильтрами на карте.
 *
 * @param {boolean} isFormFieldsActive - если true, поля активны для ввода,
 * иначе - false.
 */
var makeFormFieldsActive = function (isFormFieldsActive) {
  var formElements = {
    fieldsets: form.querySelectorAll('.ad-form__element'),
    mapFilters: map.querySelectorAll('.map__filter')
  };

  for (var elements in formElements) {
    if (formElements.hasOwnProperty(elements)) {
      formElements[elements].forEach(function (element) {
        if (isFormFieldsActive) {
          element.removeAttribute('disabled');
        } else {
          element.setAttribute('disabled', true);
        }
      });
    }
  }
};

/**
 * Переводит страницу в активное состояние.
 */
var makePageActive = function () {
  var announcements = generateAllAnnouncements(NUMBER_OF_ANNOUNCEMENTS);
  var htmlPins = renderPins(announcements);

  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  makeFormFieldsActive(true);
  appendPins(htmlPins);
  appendAnnouncements(announcements);
  Page.active = true;
};

/**
 * Устанавливает значения поля ввода адреса.
 */
var setAddressInputValues = function () {
  var addressInput = form.querySelector('input[name="address"]');

  addressInput.value = Page.active ?
    '{' + (parseInt(mainMapPin.style.left, 10) + PIN_WIDTH / 2) + '}, {'
  + (parseInt(mainMapPin.style.top, 10) + PIN_HEIGHT / 2) + '}' :
    '{' + (parseInt(mainMapPin.style.left, 10) + PIN_WIDTH / 2) + '}, {'
  + (parseInt(mainMapPin.style.top, 10) + PIN_HEIGHT) + '}';
};

var validityRoomsAndGuests = function () {
  var roomsUserValue = form.querySelector('select[name="rooms"] option:checked').value;
  var guestsSelect = form.querySelector('select[name="capacity"]');
  var guestsUserValue = guestsSelect.querySelector('option:checked').value;

  if (roomsUserValue === '100' && guestsUserValue !== '0') {
    guestsSelect.setCustomValidity('Данное количество комнат предназначено не для гостей');
  } else if (guestsUserValue === '0' && roomsUserValue !== '100') {
    guestsSelect.setCustomValidity('Для данного количества гостей предназначено только 100 комнат');
  } else if (guestsUserValue !== '100' && (guestsUserValue > roomsUserValue)) {
    guestsSelect.setCustomValidity('Максимальное количество гостей: ' + roomsUserValue);
  } else {
    guestsSelect.setCustomValidity('');
  }
};

makeFormFieldsActive(false);
setAddressInputValues();

mainMapPin.addEventListener('mousedown', function () {
  if (!Page.active) {
    makePageActive();
  }
  setAddressInputValues();
});

mainMapPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    if (!Page.active) {
      makePageActive();
    }
    setAddressInputValues();
  }
});

submitFormBtn.addEventListener('click', function () {
  validityRoomsAndGuests();
});

submitFormBtn.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    validityRoomsAndGuests();
  }
});
