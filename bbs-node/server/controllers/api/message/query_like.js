/**
 * @overview
 * @author cisong
 * @date 3/31/16
 */

const MessageService = require('services/message');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const pageNo = parseInt(this.query.pageNo, 10) || 1;
        const messageService = new MessageService(this);

        return messageService.queryLike({pageNo});
    });
};
