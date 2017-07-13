var post = {
    tid: 2001,
    subject: '外面<em>呆</em>在再久，也少了点家的感觉',
    message: '在外面<em>呆</em>久了，你还真的觉得只有重庆这块地是宝地的感觉！可能就是大家都说的“金窝银窝不如自己的狗窝',
    postUrl: 'http://bbs.wacai.com/forum.php?mod=viewthread&tid=2599940&popup=1'
};

module.exports = function () {
    return {
        // $$delay: 200,
        "code": 0,
        "data": Array.apply(null, {length: 15}).map(function () {
            return post;
        })
    };
};
