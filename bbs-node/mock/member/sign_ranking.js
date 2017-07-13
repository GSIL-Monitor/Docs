/**
 * @overview
 * @author cisong
 * @date 4/18/16
 */

module.exports = function (req) {
    const items = Array.apply(null, {length: 20}).map((val, idx) => {
        return {
            uid: 233,
            nickName: '猴小猴',
            continueSignDay: 20,
            headImgUrl: 'http://avatar.wacdn.com/e10ba4adc6d7711930c18f4751e8819.jpg',
            ranking: idx
        };
    });

    return {
        code: 0,
        data: items
    };
};
