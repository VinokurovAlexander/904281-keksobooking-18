'use strict';

(function () {
  var DEFAULT_AVATAR_PREVIEW_IMG = 'img/muffin-grey.svg';

  function isImage(fileName) {
    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  }

  window.preview = {
    /**
     * Функция удаляет preview изображения из формы.
     */
    removeAll: function () {
      avatarPreview.src = DEFAULT_AVATAR_PREVIEW_IMG;
      var offersPhotos = document.querySelectorAll('.ad-form__photo');
      var firstOfferPhoto = offersPhotos[0].querySelector('img');

      if (firstOfferPhoto) {
        firstOfferPhoto.remove();
      }

      if (offersPhotos.length > 1) {
        offersPhotos.forEach(function (photo, index) {
          if (index !== 0) {
            photo.remove();
          }
        });
      }
    }
  };

  var Preview = function (fileChooser, preview) {
    this.fileChooser = fileChooser;
    this.preview = preview;
  };

  Preview.prototype.changeHandler = function () {
    var file = this.fileChooser.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();
      if (isImage(fileName)) {
        this.reader = new FileReader();
        this.reader.addEventListener('load', this.loadHandler.bind(this));
        this.reader.readAsDataURL(file);
      }
    }
  };

  var avatarFileChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var avatar = new Preview(avatarFileChooser, avatarPreview);

  avatar.loadHandler = function () {
    this.preview.src = avatar.reader.result;
  };
  avatar.fileChooser.addEventListener('change', avatar.changeHandler.bind(avatar));

  var offerPhotosChooser = document.querySelector('#images');
  var offerPhotosContainer = document.querySelector('.ad-form__photo-container');
  var offerPhotosPreview = document.querySelector('.ad-form__photo');
  var offer = new Preview(offerPhotosChooser, offerPhotosPreview);

  offer.loadHandler = function () {
    if (offerPhotosPreview) {
      offerPhotosPreview.remove();
    }

    var div = document.createElement('div');
    div.className = 'ad-form__photo';
    var img = document.createElement('img');
    img.style.width = '100%';
    img.src = offer.reader.result;
    div.append(img);
    offerPhotosContainer.append(div);
  };
  offer.fileChooser.addEventListener('change', offer.changeHandler.bind(offer));
})();
