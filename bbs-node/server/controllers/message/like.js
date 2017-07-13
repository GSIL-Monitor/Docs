/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

'use strict';

const MessageService = require('services/message');

module.exports = function*() {
    const data = yield Promise.resolve().then(() => {
        const messageService = new MessageService(this);

        return messageService.queryLike().then((ret) => {
            return {
                items: ret.data || []
            };
        });
    });

    yield this.render('message/like/index', data);
};

