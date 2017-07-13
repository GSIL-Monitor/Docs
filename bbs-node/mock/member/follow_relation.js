module.exports = function (req) {
    return {
        "code": 0,
        "data": [
            {
                "uid": 1, //当前用户ID
                "followuid": 2230070, //关注用户ID
                "bkname": "aaa", //关注备注
                "status": 0, //:0 正常 1:特殊关注 -1:不能再关注此人
                "mutual": 1 // 0:单向 1:已互相关注
            }
        ]
    };
};
