/**
 * @overview
 * @author cisong
 * @date 3/31/16
 */

const MessageService = require('services/message');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const form = this.request.body;

        if (!form.targetUid || !form.message) {
            return Promise.reject();
        }

        if (form.message.length > 250) {
            return Promise.reject('输入超出250个字符!');
        }

        const messageService = new MessageService(this);

        return messageService.sendMessage(form);
    });
};
