/**
 * @overview 帖子服务
 * @author cisong
 * @date 6/3/16
 */

'use strict';

const url = require('url');
const cheerio = require('cheerio');

const defaultGroupIcon = '//s1.wacdn.com/wis/126/8a4bb0c62ccc42c1_142x142.png';

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;
    this.request = state.request;
}

Object.setPrototypeOf(Service.prototype, {
    // 获取帖子详情
    getPostDetail(_form) {
        return this.request({
            url: this.api['post/get_detail'],
        //form{
        //    "tid": "帖子id",
        //    "needForum": "(选填, 如果需要forum信息, 填1)",
        //    "needFav": "(选填, 如果需要收藏信息, 填1)",
        //    "needLike": "(选填, 如果需要点赞信息, 填1)",
        //    "needVote" : "(新增字段, 选填, 如果需要投票信息, 填1)",
        //    "needFollow": "(选填, 如果需要关注信息, 填1)"
        //}
            form: _form
        }).then((ret) => {
            const post = ret.data.post;
            const postDetail = post.message.replace(/\s{2,}/g, '').replace(/(href=")(home.php)/g, '$1/$2');

            const forum = ret.data.forum;
            const tag = ret.data.tag;

            const $ = cheerio.load(postDetail, {
                decodeEntities: false
            });

            // 移除字体及大小设置
            $('font').removeAttr('face').removeAttr('size');

            const images = $('img');


            images.each((idx, img) => {
                const el = $(img);
                const src = el.attr('src');
                const aid = el.attr('data-aid');


                if(src){
                    el.attr('data-src', src);
                    el.removeAttr('src').addClass('lazy'); 
                }   

                // 设置 outerHTML
                const viewLink = `/forum.php?mod=viewthread&tid=${_form.tid}&aid=${aid}&from=album&page=&popup=1`;
                const href = aid ? viewLink : 'javascript:void(0)';
                const outerHTML = `<a class="js-view-large" data-img="${src}" href="${href}">${$.html(el)}</a>`;

                el.replaceWith(outerHTML);
            });

            post.message = $.html();



            if(tag && tag.icon == ''){
                tag.icon = defaultGroupIcon;
            }
            if(forum && forum.icon == ''){
                forum.icon = defaultGroupIcon;
            }

            return ret;
        });
    },

    // 获取帖子数据
    getPostStat(tid) {
        return this.request({
            url: this.api['post/get_count'],
            form: {tid}
        });
    },

    // 获取帖子热门回复
    queryHotReply(tid) {
        return this.request({
            url: this.api['post/hot_reply'],
            form: {tid}
        }).then((ret) => {
            const data = ret.data || [];

            ret.data = data.filter((item) => {
                return item.isShowAvailable === 1;
            });

            return ret;
        });
    },

    // 获取帖子回复列表
    queryReply(opts) {
        const form = Object.assign({}, {
            orderasc: 0 // 0 正序 1 倒叙
        }, {
            pageSize: 15
        }, opts);

        form.pageSize = form.pageSize > 15 ? 15 : form.pageSize;
        return this.request({
            url: this.api['post/reply_list'],
            form: form
        }).then((ret) => {
            const data = ret.data || [];

            data.forEach((item) => {
                const author = item.author || {};
                const headImgUrl = author.headImgUrl;

                if (headImgUrl) {
                    // 服务端控制缩放比例，同时需要更新新版默认头像
                    author.headImgUrl = headImgUrl;
                }
            });

            ret.data = data.filter((item) => {
                return item.isShowAvailable === 1;
            });

            return ret;
        });
    },

    // 获取单条回复
    querySingleReply(opts) {
        return this.request({
            url: this.api['post/single_reply'],
            form: opts
        });
    },

    // 收藏帖子
    favOpt(tid) {
        return this.request({
            url: this.api['post/fav_opt'],
            form: {tid}
        });
    },

    // 帖子点赞
    likeOpt(tid) {
        return this.request({
            url: this.api['post/like_opt'],
            form: {tid}
        });
    },

    // 获取推荐帖子列表
    queryRecommendPosts() {
        return this.request({
            url: this.api['post/recommend_posts']
        }).then((ret) => {
            const data = ret.data || [];

            ret.data = data.map((item) => {
                const picUrl = item.picUrl || '';

                item.picUrl = url.resolve(picUrl, '?imageView2/0/w/160/interlace/1');

                return item;
            });

            return ret;
        });
    },

    // 获取外部分享帖子页推荐帖子列表
    getRecommendPosts(bid, pageSize) {
        return this.request({
            url: this.api['post/recommend_post'],
            method: 'GET',
            qs: {bid, pageSize}
        }).then((ret) => {
            return ret;
        });
    },

    // 获取福利人数
    getLicaiCoupon() {
        return this.request({
            url: this.api['post/bbs_licai_quan_num']
        });
    },

    // 添加福利人数
    addLicaiCount() {
        return this.request({
            url: this.api['post/add_licai_num']
        });
    },

    // 获取点赞人数列表
    getlikeList(tid, lastId, pageSize) {
        return this.request({
            url: this.api['post/get_post_liker_list'],
            method: 'GET',
            qs: {tid, lastId, pageSize}
        });
    },

    // 获取点赞人数列表
    getlikeNum(tid) {
        return this.request({
            url: this.api['post/get_post_like_num'],
            form: {tid}
        });
    },

    // 切换点赞
    like(tid) {
        return this.request({
            url: this.api['post/like'],
            form: {tid}
        });
    },

    //投票
    doVoteOption(form){
        return this.request({
            url: this.api['vote/do_vote_option'],
            form
        });
    }


});

module.exports = Service;
