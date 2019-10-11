'use strict';

(function () {
  var MinPriceAndTypes = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var form = document.querySelector('.ad-form');

  window.form = {
    /**
     * Переводит форму в активное состояние.
     */
    makeActive: function () {
      form.classList.remove('ad-form--disabled');

      makeAllFormFieldsActive(true);
      addChangeHandlerOnApartamentType();
      addCheckInAndCheckOutTimeChangeHandler();

      this.setAddressInputValues();
    },

    /**
     * Устанавливает значения поля ввода адреса.
     * При НЕактивной странице указываются координаты центра главного пина,
     * при активной странице указываются координаты острого конца пина.
     */
    setAddressInputValues: function () {
      var addressInput = form.querySelector('input[name="address"]');

      addressInput.value = window.page.active ?
        (parseInt(window.pin.main.style.left, 10) + window.pin.WIDTH / 2) + ' ' +
        (parseInt(window.pin.main.style.top, 10) + window.pin.HEIGHT / 2) :
        (parseInt(window.pin.main.style.left, 10) + window.pin.WIDTH / 2) + ' '
        + (parseInt(window.pin.main.style.top, 10) + window.pin.HEIGHT);
    }
  };

  /**
   * Изменяет активность полей формы подачи объявления
   * и формы с фильтрами на карте.
   *
   * @param {boolean} isFormFieldsActive - если true, поля активны для ввода,
   * иначе - false.
   */
  var makeAllFormFieldsActive = function (isFormFieldsActive) {
    var fields = {
      form: document.querySelectorAll('.ad-form > *'),
      mapFilters: document.querySelectorAll('.map__filters > *')
    };

    for (var parent in fields) {
      if (fields.hasOwnProperty(parent)) {
        fields[parent].forEach(function (element) {
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

  makeAllFormFieldsActive(false);
  window.form.setAddressInputValues();
})();
