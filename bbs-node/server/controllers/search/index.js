/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

'use strict';

const util = require('lib/util');
const SearchService = require('services/search');

module.exports = function*() {
	let isQianTang;
    const data = yield Promise.resolve().then(() => {
        const searchService = new SearchService(this);
		isQianTang = util.isQiantang(this);
        return searchService.queryHistory();
    }).then((ret) => {
        return {
            history: ret.data
        }
    }).catch(e => e);

   data.INIT_STATE = {
		isQianTang
   }

    yield this.render('search/index/index', data);
};
