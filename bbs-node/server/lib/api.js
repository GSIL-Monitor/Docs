/**
 * @overview
 * @author cisong
 * @date 3/23/16
 */

'use strict';

const v2 = require('./v2/index');

const apiMap = Object.assign({}, {
    // 活动入口
    'lottery/showEntrance':'lottery/showEntrance',
    // 获取搜索历史
    'search/query_history': 'search/keys_record',
    // 清除搜索历史
    'search/clear_history': 'search/keys_clean',
    // 搜索默认
    'search/search_default': 'search/search_default',
    // 搜索用户
    'search/search_user': 'search/search_user',
    // 搜索帖子
    'search/search_post': 'search/search_post',
    // 搜索用户v1
    'search/search_user_v1': 'search/search_user_v1',
    // 搜索帖子v1
    'search/search_post_v1': 'search/search_post_v1',

    // 获取赞列表
    'message/query_like': 'notify/query_like_history',
    // 获取回复列表
    'message/query_reply': 'notify/query_reply_history',
    // 获取消息数量
    'message/count_notify': 'notify/get_all_notify_num',
    // 重置粉丝消息数量
    'message/reset_follow': 'notify/reset_follow_num',
    // 私信列表
    'message/query_inbox': 'msg/get_session_list',
    // 私信详情列表
    'message/query_message': 'msg/get_message_list',
    // 发送私信
    'message/send_message': 'msg/send_message',

    // 获取当前登录用户信息
    'member/current_info': 'member/current_user_info',
    // 获取当前登录用户更多信息
    'member/more_info': 'member/more',
    // 签到
    'member/sign': 'sign/add_sign',
    // 签到用户信息
    'member/sign_info': 'sign/sign_info',
    // 签到排行榜
    'member/sign_ranking': 'sign/ranking',
    // 分享推荐
    'member/share_post': 'sign/share_post',
    // 保存昵称
    'member/save_name': 'member/save_name',
    // 关注用户
    'member/follow': 'follow/add',

    // 批量关注
    'member/batch_follow': 'follow/batch_follow',

    // 取消关注
    'member/unfollow': 'follow/del',

    //帖子详细 推荐达人
    "member/get_tag_list": 'daren/get_tag_list',

    // 推荐帖子
    'common/recommend_post': 'recommend/share_post',
    // 帖子详情推荐理财
    'common/recommend_bonus': 'ad/get_ad_list',


    // 获取帖子详情
    'post/get_detail': 'post/get_detail',
    // 获取帖子数据
    'post/get_count': 'post/get_count',
    // 获取帖子热门回复
    'post/hot_reply': 'reply/query_hot_replylist',
    // 获取帖子回复列表
    'post/reply_list': 'reply/query_replylist',
    // 获取单条回复
    'post/single_reply': 'reply/query_one_reply',
    // 给帖子点赞
    'post/like_opt': 'like/opt',
    // 收藏帖子
    'post/fav_opt': 'favorite/opt',

    // 获取福利人数
    'post/bbs_licai_quan_num': 'stats/get_finance_coupon_num',

    // 添加福利人数
    'post/add_licai_num': 'stats/add_finance_coupon_num',

    // 获取板块详情
    'forum/get_detail': 'forum/get_detail',

    //推荐页banner
    'recommend/get_banners': {
        server: {
            development:"http://api.dev.wacai.info/",
            test: "http://api.test.wacai.info/",
            staging: "http://basic.wacai.com/",
            production: "http://basic.wacai.com/"
        },
        path: "basic-biz/banners/list"
    },

    //推荐页话题位
    'recommend/get_topics': 'topic/get_list',

    //关注页新消息数量
    'recommend/get_followUpdateNum': {
        server: {
            test: "http://bbs.wacaiyun.com/",
            staging: "http://bbs.staging.wacai.com/",
            production: "http://bbs.wacai.com/"
        },
        path: "home.php"
    },

    // 推荐页推荐列表
    // 'recommend/get_recommend': 'recommend/get',

    // v2.0 替换
    // 'recommend/get_recommend': 'recommend/get_recommend_tag_posts',
    
    // v2.2 替换
    'recommend/get_recommend': 'recommend/get_recommend_tag_posts_with_mc',

    //个性化推荐列表
    "recommend/get_birecommend": 'recommend/get_bi_posts',

    // v2.0 新增
    "recommend/getEditor": 'recommend/get_editor_posts',

    "recommend/feedback": "recommend/feedback",

    //热门用户推荐
    "recommend/hot_users": 'daren/get_list',

    //热门用户推荐
    "recommend/get_misc_data": 'recommend/get_misc_data',

    // 活跃之星列表
    'star/get_by_index': 'star/get_by_index',

    //社区达人列表
    "hot_users/list": "daren/get_list",

    // 获取我感兴趣的标签
    'guide/get_tags': 'tag/get_mylike_tags',

    // 获取用户与其他用户关系
    'member/follow_relation': 'follow/get_follow_relation',

    // 新人引导 推荐达人
    'guide/get_guide_list' : 'daren/get_guide_list',

    // 分享版帖子详情推荐阅读
    'post/recommend_posts': 'post/get_recommend_post',

    // 点赞用户列表
    'post/get_post_liker_list': 'like/get_user_list',

    // 标签页信息
    'tag/basic_info': 'tag/get_page_info',

    // 标签订阅用户列表接口
    'tag/subscribe_member': 'tag/get_tag_subscribe_member',

    // 订阅兴趣的标签
    'tag/save_tags': 'tag/add_mylike_tags',

    // 查询标签帖子列表: 最新
    'tag/new_post_list': 'tag/get_new_post',

    // 查询我加入的小组情况
    'tag/my_tag_list': 'tag/my_tag_list',
    
    // 查询小组信息
    'tag/get_page_info': 'tag/get_page_info',

    // 查询标签帖子列表: 精华
    'tag/digest_post_list': 'tag/get_digest_post',
    // 更新帖子未读数
    'tag/update_read_count':'tag/update_read_count',
    //收藏页
    'favorite/get_my_favlist':'favorite/get_my_favlist',
    // 用户信息
    'uc/get_batch_profile': {
        server: {
            development:'http://api.dev.wacai.info/',
            test: 'http://api.test.wacai.info/',
            staging: 'http://api.staging.wacai.com/',
            production: 'http://api.wacai.com/'
        },
        path: 'uc/get_batch_profile/byUids'
    },

    // banner
    'jinnang/get_banners': {
        server: {
            development:'http://api.dev.wacai.info/',
            test: 'http://api.test.wacai.info/',
            staging: 'http://api.staging.wacai.com/',
            production: 'http://basic.wacai.com/'
        },
        path: 'basic-biz/banners/list'
    },

    'home/person_page': 'home/person_page',

    // 个人主页下拉加载更多
    'home/more_post': 'home/more_post',
    'tag/digest_post_list': 'tag/get_digest_post'
},v2);

module.exports = function(env, port) {
    const api = {};
    const envMap = {
        dev: `http://localhost:${port}/mock/`,
        development: 'http://api.bbs.dev.wacai.info/api2/',
        test: 'http://api.bbs.test.wacai.info/api2/',
        staging: 'http://api.bbs.staging.wacai.info/api2/',
        production: 'http://api.bbs.wacai.info/api2/'
    };

    env = env || process.env.NODE_ENV || 'dev';

    Object.keys(apiMap).map(function(key) {
        if (env == 'dev') {
            api[key] = envMap[env] + key;
        } else {
            if (apiMap[key].server) {
                api[key] = apiMap[key]["server"][env] + apiMap[key].path;
            } else {
                api[key] = envMap[env] + apiMap[key];
            }

        }
    });

    return api;
};
