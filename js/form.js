'use strict';

(function () {
  var NUMBER_OF_ANNOUNCEMENTS = 8;

  var MinPriceAndTypes = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var page = {
    active: false
  };
  var form = document.querySelector('.ad-form');

  window.form = {
    /**
     * Переводит форму в активное состояние.
     */
    makeFormActive: function () {
      if (!page.active) {
        var announcements = window.data.generateAllAnnouncements(NUMBER_OF_ANNOUNCEMENTS);
        var htmlPins = window.pin.generatePins(announcements);
        var htmlCards = window.card.generateCards(announcements);
        window.map.appendPins(htmlPins);
        window.map.appendCards(htmlCards);

        window.map.section.classList.remove('map--faded');
        form.classList.remove('ad-form--disabled');

        makeFormFieldsActive(true);
        addChangeHandlerOnApartamentType();
        addCheckInAndCheckOutTimeChangeHandler();

        page.active = true;
        setAddressInputValues();
      }
    }
  };

  /**
   * Изменяет активность полей формы подачи объявления
   * и формы с фильтрами на карте.
   *
   * @param {boolean} isFormFieldsActive - если true, поля активны для ввода,
   * иначе - false.
   */
  var makeFormFieldsActive = function (isFormFieldsActive) {
    var formFields = {
      fieldsets: form.querySelectorAll('.ad-form__element'),
      mapFilters: window.map.section.querySelectorAll('.map__filter')
    };

    for (var fields in formFields) {
      if (formFields.hasOwnProperty(fields)) {
        formFields[fields].forEach(function (element) {
          if (isFormFieldsActive) {
            element.removeAttribute('disabled');
          } else {
            element.setAttribute('disabled', true);
          }
        });
      }
    }
  };

  var apartamentTypeSelect = form.querySelector('select[name="type"]');
  var currentApartamentTypeValue = apartamentTypeSelect.querySelector('option:checked').value;
  var priceInput = form.querySelector('#price');
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
   * Устанавливает значения поля ввода адреса.
   * При НЕактивной странице указываются координаты центра главного пина,
   * при активной странице указываются координаты острого конца пина.
   */
  var setAddressInputValues = function () {
    var addressInput = form.querySelector('input[name="address"]');

    addressInput.value = page.active ?
      '{' + (parseInt(window.map.mainPin.style.left, 10) + window.pin.PIN_WIDTH / 2) + '}, {'
    + (parseInt(window.map.mainPin.style.top, 10) + window.pin.PIN_HEIGHT / 2) + '}' :
      '{' + (parseInt(window.map.mainPin.style.left, 10) + window.pin.PIN_WIDTH / 2) + '}, {'
    + (parseInt(window.map.mainPin.style.top, 10) + window.pin.PIN_HEIGHT) + '}';
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
   * Функция для валидации формы.
   */
  var validate = function () {
    validateRoomsAndGuests();
    validatePriceAndApartamentType();
  };

  var submitFormBtn = form.querySelector('.ad-form__submit');
  submitFormBtn.addEventListener('click', function () {
    validate();
  });
  submitFormBtn.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, validate);
  });

  makeFormFieldsActive(false);
  setAddressInputValues();
})();
