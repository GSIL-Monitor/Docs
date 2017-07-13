/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

'use strict';

const escape = require('escape-html');
const SearchService = require('services/search');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const keyword = this.query.keyword;
        const currPage = parseInt(this.query.currPage, 10) || 1;

        if (!keyword || keyword.length > 100 || currPage < 0) {
            return Promise.reject();
        }

        const searchService = new SearchService(this);

        return searchService.searchUserV1(escape(keyword), currPage);
    });
};
