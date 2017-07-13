/**
 * @overview
 * @author cisong
 * @date 3/31/16
 */

const MessageService = require('services/message');

module.exports = function*(next) {
    const targetUid = parseInt(this.query.targetUid);

    this.body = yield Promise.resolve().then(() => {
        if (!targetUid) {
            return Promise.reject('不存在的会话');
        }

        const messageService = new MessageService(this);

        return messageService.queryMessage(this.query);
    });
};
