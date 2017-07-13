/**
 * @overview
 * @author cisong
 * @date 5/13/16
 */

module.exports = function (req) {
    return {
        code: 0,
        error: '180 天内只能修改一次',
        data: true
    };
};
