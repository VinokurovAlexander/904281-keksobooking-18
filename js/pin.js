'use strict';

(function () {
  var Pin = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('button');
  var mainPin = {
    WIDTH: 65,
    HEIGHT: 65,

    element: document.querySelector('.map__pin--main'),
    /**
     * Возвращает пин к исходному положению.
     */
    backToStart: function () {
      this.element.style.left = mainPin.startCoords.x;
      this.element.style.top = mainPin.startCoords.y;
    },
    /**
     * Добавляет и удалет обработчик для главного пина.
     *
     * @param {boolean} add - Флаг.
     */
    addMousemoveHandler: function (add) {
      if (add) {
        mainPin.element.addEventListener('mousedown', mouseMoverHandler);
      } else {
        mainPin.element.removeEventListener('mousedown', mouseMoverHandler);
      }
    }
  };

  mainPin.startCoords = {
    x: getComputedStyle(mainPin.element).left,
    y: getComputedStyle(mainPin.element).top
  };

  window.pin = {
    WIDTH: Pin.WIDTH,
    HEIGHT: Pin.HEIGHT,

    main: mainPin,

    /**
     * Генерирует массив с нодами пинов офферов.
     *
     * @param {array} announcements - Массив с объектами офферов.
     * @return {array} Массив с нодами пинов для карты.
     */
    generatePins: function (announcements) {
      var pins = [];

      announcements.forEach(function (advert) {
        var pinElement = pinTemplate.cloneNode(true);
        var pinImg = pinElement.querySelector('img');

        var avatarUrl = advert.author.avatar;
        pinImg.setAttribute('src', avatarUrl);

        var offerTitle = advert.offer.title;
        pinImg.setAttribute('alt', offerTitle);

        var locationX = advert.location.x + Pin.WIDTH / 2 + 'px';
        var locationY = advert.location.y + Pin.HEIGHT + 'px';
        var pinCoordinates = 'left: ' + locationX + '; ' + 'top: ' + locationY + ';';
        pinElement.setAttribute('style', pinCoordinates);

        pins.push(pinElement);
      });
      return pins;
    }
  };

  /**
   * Обработчик для перемещения пина.
   *
   * @param {object} evt - Объект события.
   */
  var mouseMoverHandler = function (evt) {
    var coords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      var shift = {
        x: coords.x - moveEvt.clientX,
        y: coords.y - moveEvt.clientY,
      };

      coords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var pinStyleCoords = {
        x: mainPin.element.offsetLeft - shift.x,
        y: mainPin.element.offsetTop - shift.y
      };

      if (pinStyleCoords.x > window.map.Location.X.MAX) {
        pinStyleCoords.x = window.map.Location.X.MAX;
      } else if (pinStyleCoords.x < window.map.Location.X.MIN) {
        pinStyleCoords.x = window.map.Location.X.MIN;
      }

      if (pinStyleCoords.y > window.map.Location.Y.MAX) {
        pinStyleCoords.y = window.map.Location.Y.MAX;
      } else if (pinStyleCoords.y < window.map.Location.Y.MIN) {
        pinStyleCoords.y = window.map.Location.Y.MIN;
      }

      mainPin.element.style.left = pinStyleCoords.x + 'px';
      mainPin.element.style.top = pinStyleCoords.y + 'px';

      window.form.setAddressInputValues();
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.form.setAddressInputValues();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mainPin.element.addEventListener('click', function (evt) {
    if (evt.which === 1) {
      window.backend.load(
          window.backend.URL.LOAD,
          window.page.makeActive,
          window.error.handler
      );
    }
  });
})();
