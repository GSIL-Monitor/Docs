/**
 * Created by L3au on 8/30/16.
 */
'use strict';

const PostService = require('services/post');

module.exports = function*() {
    const postService = new PostService(this);

    this.body = yield Promise.resolve().then(() => {
        return postService.queryRecommendPosts();
    });
};
