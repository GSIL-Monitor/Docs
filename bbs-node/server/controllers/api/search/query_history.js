/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

'use strict';

const SearchService = require('services/search');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const searchService = new SearchService(this);

        return searchService.queryHistory();
    });
};
