/**
 * 收藏页
 * @zanghong
 */

'use strict';
const FavoriteService = require('services/favorite');

module.exports = function*() {

    const pageSize=15; //页大小，默认15
    const page=1;//页码，默认第一页
    const query={pageSize:pageSize,page:page};
    const data = yield Promise.resolve().then(() => {
        const favoriteService = new FavoriteService(this);
        return favoriteService.getMyFavlist(query);
    }).then((ret) => {
        ret.INIT_STATE={
            page:page,
            pageSize:pageSize
        };
        return ret;
    });
	yield this.render('favorite/index', data);
};