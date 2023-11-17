
const ImageFilesRepository = require('./imageFilesRepository.js');
const UsersRepository = require('./usersRepository.js');
const ImageModel = require('./image.js');
const HttpContext = require('../httpContext').get();

module.exports =
    class ImagesRepository extends require('./repository') {
        constructor() {
            super(new ImageModel(), true /* cached */);
            this.setBindExtraDataMethod(this.bindImageURLAndUser);
            this.UsersRepository = new UsersRepository();
        }
        bindImageURLAndUser(image) {
            if (image) {
                let bindedImage = { ...image };
                if (image["GUID"] != "") {
                    bindedImage["OriginalURL"] = HttpContext.host + ImageFilesRepository.getImageFileURL(image["GUID"]);
                    bindedImage["ThumbnailURL"] = HttpContext.host + ImageFilesRepository.getThumbnailFileURL(image["GUID"]);
                } else {
                    bindedImage["OriginalURL"] = "";
                    bindedImage["ThumbnailURL"] = "";
                }
                let user = this.UsersRepository.get(bindedImage.UserId);
                if (user) {
                    bindedImage.User = user;
                    bindedImage.Username = user.Name;
                }
                return bindedImage;
            }
            return null;
        }
        getAll(params = null) {
            let images = super.getAll(params);
            if (params != null && params.keywords != null) {
                let imagesRetained = [];
                let keywords = params.keywords.split(" ");
                if (keywords.length > 0) {
                    for (let image of images) {
                        let text = (image.Title + image.Description).toLowerCase();
                        let retain = true;
                        for (let keyword of keywords) {
                            if (text.indexOf(keyword) < 0) {
                                retain = false;
                                break;
                            }
                        }
                        if (retain) imagesRetained.push(image);
                    }
                }
                return imagesRetained;
            } else {
                return images;
            }
        }
        add(image) {
            if (this.model.valid(image)) {
                image["GUID"] = ImageFilesRepository.storeImageData("", image["ImageData"]);
                delete image["ImageData"];
                return this.bindImageURLAndUser(super.add(image));
            }
            return null;
        }
        update(image) {
            if (this.model.valid(image)) {
                image["GUID"] = ImageFilesRepository.storeImageData(image["GUID"], image["ImageData"]);
                delete image["ImageData"];
                return super.update(image);
            }
            return false;
        }
        remove(id) {
            let foundImage = super.get(id);
            if (foundImage) {
                ImageFilesRepository.removeImageFile(foundImage["GUID"]);
                return super.remove(id);
            }
            return false;
        }
    }
