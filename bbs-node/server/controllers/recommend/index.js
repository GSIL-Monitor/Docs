/**
 * @overview 推荐页
 * @author qingtong
 * @date 1/12/17
 */
'use strict';

const RecommendService = require('model/recommend');
const util = require('lib/util');
const sdks = require('store/sdk');

module.exports = function*() {

    const platform = util.getPlatform(this) || this.query.platform || 70;
    const data = yield RecommendService(this, platform);
    const isBBSApp = util.isBBSApp(this);

    const ret = data.data;

    const { recommendList, biRecommends, sdkUpdate } = ret;
    ret.INIT_STATE.isBBSApp = isBBSApp;
    ret.INIT_STATE.platform = platform;

    function insertBiRecommend(pos){
        if(biRecommends[0]) {
            biRecommends[0].personal = true;
            _recommendList.splice(pos, 0, biRecommends[0]);
        }
    }

    // 普通帖子（1：订阅标签下的热门，2：编辑推荐, 3: 推荐标签下的热门）
    let _recommendList = recommendList.filter((list) => {
        return list.bizType == 1 || list.bizType == 2 || list.bizType == 3
    });

    // 重写拼装编辑推荐帖子 废弃2.2
    // if(editorRecommends[0]) {
    //     _recommendList.splice(2, 0, editorRecommends[0]);
    // }
    
    if(sdkUpdate && sdkUpdate.open == 1){
        insertBiRecommend(3);
    }else{
        insertBiRecommend(4);
    }

    // if(editorRecommends[1]) {
    //     _recommendList.splice(5, 0, editorRecommends[1]);
    // }
    if(biRecommends[1]) {
        biRecommends[1].personal = true;
        _recommendList.splice(9, 0, biRecommends[1]);
    }
    
    ret.recommendList = _recommendList;

    // sdk升级
    if(sdkUpdate) {
        ret.sdk = Object.assign({}, {
            title: sdks.titles[Math.floor(Math.random() * sdks.titles.length)],
            content:sdks.footers[Math.floor(Math.random() * sdks.footers.length)],
        }, sdkUpdate)
    }
    
    data.isAPP = util.isApp(platform) || (this.query.sdk == '1');

    yield this.render('recommend/index', ret);

};

