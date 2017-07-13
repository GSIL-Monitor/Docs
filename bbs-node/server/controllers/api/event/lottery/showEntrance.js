/**
 * 小红包抽奖入口 qingtong
 */
'use strict';

const LotteryService = require('services/event/lottery');

module.exports = function*() {
    const lotteryService = new LotteryService(this);

    this.body = yield Promise.resolve().then(() => {
        const query = this.query;

        return lotteryService.showEntrance();
    });
};