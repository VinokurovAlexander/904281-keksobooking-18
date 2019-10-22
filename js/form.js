'use strict';

(function () {
  var MinPriceAndTypes = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var form = document.querySelector('.ad-form');
  var filters = document.querySelector('.map__filters');

  window.form = {
    /**
     * Меняет активность формы.
     *
     * @param {object} makeActive - Флаг.
     */
    makeActive: function (makeActive) {
      if (makeActive) {
        form.classList.remove('ad-form--disabled');
      } else {
        form.classList.add('ad-form--disabled');
        form.reset();
        filters.reset();
        window.preview.removeAll();
      }
      addChangeHandlerOnApartamentType(makeActive);
      makeAllFormFieldsActive(makeActive);
      addCheckInAndCheckOutTimeChangeHandler(makeActive);
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
        (parseInt(window.pin.main.element.style.left, 10) + Math.round(window.pin.main.WIDTH / 2)) + ', ' +
        (parseInt(window.pin.main.element.style.top, 10) + Math.round(window.pin.main.HEIGHT / 2)) :
        (parseInt(window.pin.main.element.style.left, 10) + Math.round(window.pin.main.WIDTH / 2)) + ', '
        + (parseInt(window.pin.main.element.style.top, 10) + Math.round(window.pin.main.HEIGHT));
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
   * Функция для для отображения
   * соответствующего placeholder у поля "Цена за ночь".
   */
  var apartamentTypeHandler = function () {
    currentApartamentTypeValue = apartamentTypeSelect.querySelector('option:checked').value;
    priceInput.setAttribute('placeholder', MinPriceAndTypes[currentApartamentTypeValue]);
  };

  /**
   * Добавление обрабочика на поле "Тип жилья" для отображения
   * соответствующего placeholder у поля "Цена за ночь".
   *
   * @param {boolean} add - Флаг.
   */
  var addChangeHandlerOnApartamentType = function (add) {
    if (add) {
      apartamentTypeSelect.addEventListener('change', apartamentTypeHandler);
    } else {
      apartamentTypeSelect.removeEventListener('change', apartamentTypeHandler);
    }
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
   * Функция для синхронизации между
   * полями "Время заезда и выезда".
   */
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');

  var timeinHandler = function () {
    timeout.value = timein.value;
  };
  var timeoutHanlder = function () {
    timein.value = timeout.value;
  };

  /**
   * Добавляет или удаляет обработчик для
   * синхронизации между полями "Время заезда и выезда".
   *
   * @param {boolean} add - Флаг.
   */
  var addCheckInAndCheckOutTimeChangeHandler = function (add) {
    if (add) {
      timein.addEventListener('change', timeinHandler);
      timeout.addEventListener('change', timeoutHanlder);
    } else {
      timein.removeEventListener('change', timeinHandler);
      timeout.removeEventListener('change', timeoutHanlder);
    }
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

  var successSaveFormData = function () {
    window.page.makeInactive();
    window.success.show();
  };

  var submitFormBtn = form.querySelector('.ad-form__submit');
  submitFormBtn.addEventListener('click', function () {
    validate();
  });

  submitFormBtn.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, validate);
  });

  document.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(
        window.backend.URL.SAVE,
        successSaveFormData,
        window.error.handler,
        new FormData(form)
    );
  });

  var resetBtn = form.querySelector('.ad-form__reset');
  resetBtn.addEventListener('click', function () {
    window.page.makeInactive();
  });

  makeAllFormFieldsActive(false);
  window.form.setAddressInputValues();
})();
