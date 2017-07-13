var FavoriteService = require('services/favorite');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
    	const query = this.query;
        const favoriteService = new FavoriteService(this);
        return favoriteService.getMyFavlist(query);
    });
};