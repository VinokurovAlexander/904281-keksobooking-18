'use strict';

var ApartamentTypes = {
  FLAT: 'Квартира',
  BUNGALO: 'Бунгало',
  HOUSE: 'Дом',
  PALACE: 'Дворец'
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
var ESC_KEYCODE = 27;
var MinPriceAndTypes = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};
var form = document.querySelector('.ad-form');
var map = document.querySelector('.map');
var mapPinsWrapper = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('button');
var announcementTemplate = document.querySelector('#card')
    .content
    .querySelector('article');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mainMapPin = map.querySelector('.map__pin--main');
var page = {
  active: false
};
var submitFormBtn = form.querySelector('.ad-form__submit');
var apartamentTypeSelect = form.querySelector('select[name="type"]');
var currentApartamentTypeValue = apartamentTypeSelect.querySelector('option:checked').value;
var priceInput = form.querySelector('#price');

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
        type: getRandomValueFromArray(Object.keys(ApartamentTypes)),
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

  pins.forEach(function (pin) {
    fragment.appendChild(pin);
  });
  mapPinsWrapper.appendChild(fragment);
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
    announcementElement.querySelector('.popup__type').textContent = ApartamentTypes[advert.offer.type];
    announcementElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' ' + advert.offer.guests;
    announcementElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
    announcementElement.querySelector('.popup__description').textContent = advert.offer.description;
    announcementElement.querySelector('.popup__avatar').setAttribute('src', advert.author.avatar);
    announcementElement.classList.add('popup--closed');

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
 * Переводит форму в активное состояние.
 */
var makeFormActive = function () {
  var announcements = generateAllAnnouncements(NUMBER_OF_ANNOUNCEMENTS);
  var htmlPins = renderPins(announcements);

  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  makeFormFieldsActive(true);
  appendPins(htmlPins);
  appendAnnouncements(announcements);
  page.active = true;
};

/**
 * Устанавливает значения поля ввода адреса.
 * При НЕактивной странице указываются координаты центра главного пина,
 * при активной странице указываются координаты острого конца пина.
 */
var setAddressInputValues = function () {
  var addressInput = form.querySelector('input[name="address"]');

  addressInput.value = page.active ?
    '{' + (parseInt(mainMapPin.style.left, 10) + PIN_WIDTH / 2) + '}, {'
  + (parseInt(mainMapPin.style.top, 10) + PIN_HEIGHT / 2) + '}' :
    '{' + (parseInt(mainMapPin.style.left, 10) + PIN_WIDTH / 2) + '}, {'
  + (parseInt(mainMapPin.style.top, 10) + PIN_HEIGHT) + '}';
};

/**
 * Производится проверка соответствия заполненных данных о
 * количестве комнат и гостей.
 */
var validateRoomsAndGuests = function () {
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

/**
 * Функция для обработки событий при нажатию на ESC.
 *
 * @param {object} evt - объект события
 * @param {function} action - фукнция, которую необходимо выполнить
 */
var isEscEvent = function (evt, action) {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

/**
 * Функция для обработки событий при нажатию на ENTER.
 *
 * @param {object} evt - объект события
 * @param {function} action - фукнция, которую необходимо выполнить
 */
var isEnterEvent = function (evt, action) {
  if (evt.keyCode === ENTER_KEYCODE) {
    action();
  }
};

/**
 * Добавляет обработчики для пинов на событие click.
 */
var addMapPinsClickHandler = function () {
  var mapPins = mapPinsWrapper.querySelectorAll('button[type="button"]');

  mapPins.forEach(function (pin, index) {
    pin.addEventListener('click', function () {
      closeAd();
      openAd(index);
    });
  });
};

/**
 * Открывает карточку с объявлением.
 *
 * @param {number} itemNumber - порядковый номер карточки.
 */
var openAd = function (itemNumber) {
  var adverts = map.querySelectorAll('.popup');
  adverts[itemNumber].classList.remove('popup--closed');
  addCloseAdvertsClickHandler();
};

/**
 * Закрывает карточку с объявлением.
 */
var closeAd = function () {
  var adverts = map.querySelectorAll('.popup');
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
  var advertsCloseBtn = map.querySelectorAll('.popup__close');
  advertsCloseBtn.forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeAd();
      btn.removeEventListener('keydown', isEscEvent);
    });
  });
};

/**
 * Добавление обрабочика на поле "Тип жилья" для отображения
 * соответствующего placeholder у поля "Цена за ночь".
 */
var addChangeHandlerOnApartamentType = function () {
  apartamentTypeSelect.addEventListener('change', function () {
    currentApartamentTypeValue = apartamentTypeSelect.querySelector('option:checked').value;
    priceInput.setAttribute('placeholder', MinPriceAndTypes[currentApartamentTypeValue]);
  });
};

/**
 * Синхронизация между полями "Время заезда и выезда".
 */
var addCheckInAndCheckOutTimeChangeHandler = function () {
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');

  timein.addEventListener('change', function () {
    timeout.value = timein.value;
  });

  timeout.addEventListener('change', function () {
    timein.value = timeout.value;
  });
};

/**
 * Проверка на соответсвие поля "Тип жилья" и "Цена за ночь".
 */
var validatePriceAndApartamentType = function () {
  if (priceInput.value < MinPriceAndTypes[currentApartamentTypeValue]) {
    priceInput.setCustomValidity('Минимальная цена за ночь: ' + MinPriceAndTypes[currentApartamentTypeValue]);
  } else {
    priceInput.setCustomValidity('');
  }
};

/**
 * Функция для активации всей страницы.
 */
var activatePage = function () {
  if (!page.active) {
    makeFormActive();
    addMapPinsClickHandler();
    addChangeHandlerOnApartamentType();
    addCheckInAndCheckOutTimeChangeHandler();
    setAddressInputValues();
  }
};

/**
 * Функция для валидации формы.
 */
var validate = function () {
  validateRoomsAndGuests();
  validatePriceAndApartamentType();
};

makeFormFieldsActive(false);
setAddressInputValues();

mainMapPin.addEventListener('mousedown', function () {
  activatePage();
});
mainMapPin.addEventListener('keydown', function (evt) {
  isEnterEvent(evt, activatePage());
});

submitFormBtn.addEventListener('click', function () {
  validate();
});
submitFormBtn.addEventListener('keydown', function (evt) {
  isEnterEvent(evt, validate());
});

map.addEventListener('keydown', function (evt) {
  isEscEvent(evt, closeAd);
});
