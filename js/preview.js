'use strict';

(function () {
  function isImage(fileName) {
    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  }

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
