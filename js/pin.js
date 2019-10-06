'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('button');
  window.pin = {
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,

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

        var locationX = advert.location.x + PIN_WIDTH / 2 + 'px';
        var locationY = advert.location.y + PIN_HEIGHT + 'px';
        var pinCoordinates = 'left: ' + locationX + '; ' + 'top: ' + locationY + ';';
        pinElement.setAttribute('style', pinCoordinates);

        pins.push(pinElement);
      });
      return pins;
    }
  };
})();
