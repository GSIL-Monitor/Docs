/**
 * Created by L3au on 8/3/16.
 */
'use strict';

const TagService = require('services/tag');

module.exports = function*() {
    const tagService = new TagService(this);

    this.body = yield Promise.resolve().then(() => {
        const fids = this.request.body.fids;
        const canel_tags = this.request.body.canel_tags;

        return tagService.saveTags(fids,canel_tags);
    });
};
