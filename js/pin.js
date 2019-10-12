'use strict';

(function () {
  var Pin = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('button');
  var mainPin = document.querySelector('.map__pin--main');

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
    },

    /**
     * Добавляет обработчик для главного пина.
     */
    addMousemoveHandler: function () {
      mainPin.addEventListener('mousedown', function (evt) {
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
            x: mainPin.offsetLeft - shift.x,
            y: mainPin.offsetTop - shift.y
          };

          if (pinStyleCoords.x > window.map.Location.X_MAX) {
            pinStyleCoords.x = window.map.Location.X_MAX;
          } else if (pinStyleCoords.x < window.map.Location.X_MIN) {
            pinStyleCoords.x = window.map.Location.X_MIN;
          }

          if (pinStyleCoords.y > window.map.Location.Y_MAX) {
            pinStyleCoords.y = window.map.Location.Y_MAX;
          } else if (pinStyleCoords.y < window.map.Location.Y_MIN) {
            pinStyleCoords.y = window.map.Location.Y_MIN;
          }

          mainPin.style.left = pinStyleCoords.x + 'px';
          mainPin.style.top = pinStyleCoords.y + 'px';

          window.form.setAddressInputValues();
        };

        var onMouseUp = function () {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          window.form.setAddressInputValues();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  };

  mainPin.addEventListener('click', function (evt) {
    if (evt.which === 1) {
      window.backend.load(
          window.backend.URL.LOAD,
          window.data.appendPinsAndCards,
          window.backend.errorHandler,
          window.page.makeActive
      );
    }
  });
  mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, window.form.makeActive);
  });
})();
