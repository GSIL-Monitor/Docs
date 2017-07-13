/**
 * @overview 铜钱账单
 * @author shushi
 * @date 7/21/16
 */
'use strict';

const CopperService = require('services/copper');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const form = this.request.query || {};

        const copperService = new CopperService(this);
        return copperService.getBillList(form);
    });
};