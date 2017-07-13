module.exports = function (req) {
    return {
        code: 0,
        error: '获取搜索历史失败',
        data: [
            {keyword: '理财'},
            {keyword: '测试'},
            {keyword: '22233'}
        ]
    };
};
