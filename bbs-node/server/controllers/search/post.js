/**
 * @overview
 * @author zanghong
 * @date 1/17/17
 */

'use strict';

const escape = require('escape-html');
const SearchService = require('services/search');

module.exports = function*() {
    const keyword = this.query.keyword;

    const data = yield Promise.resolve().then(() => {
        if (!keyword || keyword.length > 100) {
            return Promise.reject();
        }

        const searchService = new SearchService(this);

        return searchService.searchPostV1(escape(keyword), 1);
    }).then((ret) => {
        return {
            page: 'post',
            keyword: keyword,
            posts: ret.data
        };
    }).catch(e => e);

    yield this.render('search/post/index', data);
};
