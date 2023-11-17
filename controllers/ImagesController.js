const ImagesRepository = require('../models/imagesRepository');
const TokenManager = require('../tokenManager');
module.exports =
    class ImagesController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext, new ImagesRepository(), false, true);
        }

        put(image) {
            let token = TokenManager.getToken(this.HttpContext.req);
            if (token) {
                if (token.UserId != image.UserId)
                    this.HttpContext.response.unAuthorized()
            }
            super.put(image);
        }
    }