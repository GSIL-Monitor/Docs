/**
 * @overview
 * @author qingtong
 * @date 7/6/17
 */

const PiaodaiService = require('services/piaodai');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
    	// 如果没有传递platform, 默认钱堂platform为70
        const { type, platform=70 } = this.query;
        const piaodaiService = new PiaodaiService(this);
        return piaodaiService.showEntrance({type, platform});
    });
};
