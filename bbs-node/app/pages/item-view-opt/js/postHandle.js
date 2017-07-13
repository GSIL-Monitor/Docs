import request from 'request';
import util from '@finance/util';
import Toast from '@wac/toast';
import Vue from 'vue';
import XDialog from 'wux/components/dialog';
import wxShare from '@wac/wechat-share';
import url from 'url';
const likerTpl = require('../tpl/liker.html?tpl');

const handle = {
    init() {
        this.state = {
            likers:  window.__INIT_DATA__.likeList
        };
        this.initState();
        this.initWxShare();
        this.handleLikeEvent();
    },

    initState() {
        this.postState = new Vue({
            el: '#js-postWrapper',
            components: {
                XDialog
            },
            data() {
                return {
                    showModal: false,
                    like: window.__INIT_DATA__.stats.like,
                    likes: window.__INIT_DATA__.stats.likes,
                    klass: 'shareModal'
                };
            },
            methods: {
                onCancel() {
                    this.showModal = false;
                },
            }
        });
    },

    // 微信分享定制
    initWxShare() {
        const that = this;
        const agent = navigator.userAgent.toLowerCase();

        if (!agent.match(/MicroMessenger/i)) {
            return;
        }

        let imgUrl = 'https://s1.wacdn.com/wis/118/2f199d7341ca5fe7_100x100.png';

        // 微博没有标题, 取微博内容作为标题
        const contentEl = $('.post-content');
        const content = contentEl.text().slice(0, 50);
        const title = $('.post__title').text().trim() || content;
        const detailImg = contentEl.find('img');

        if (detailImg.length > 0) {
            const imgEl = $(detailImg[0]);
            imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
        }

        // 处理 img url 为 // 开始的协议
        const parsed = url.parse(imgUrl, true, true);

        parsed.protocol = location.protocol;

        imgUrl = parsed.format();

        const shareData = {
            link: location.href,
            title: title,
            desc: content,
            imgUrl: imgUrl,
            success: function() {
                that.postState.showModal = true;
            }
        };

        wxShare.register(shareData);
    },

    reqCurrentUser() {
        let that = this;
        request({
            url: '/member/get_currentuser_info'
        }).then((ret) => {
            if (ret.code != 0) return;
            // 更新头像
            // 点赞
            that.state.likers.unshift({
                avatarUrl: ret.data.userHead,
                uid: ret.data.uid
            });

            that.state.likers = that.state.likers.slice(0, 5);
            that.renderLikerList(that.state.likers);
        }).catch((err) => {
            console.log(err);
        });
    },

    renderLikerList(data) {
        let that = this;
        $('.post-fav-lists').empty().append(likerTpl.render({
            items: data
        }));
    },

    reqLikeStatus(btn, callback) {
        let that = this;

        let url = '/item/like_opt';
        request({
            url: url,
            method: 'post',
            data: {
                tid: util.getUrlQuery('tid')
            }
        }).then((ret) => {
            btn.addClass('isLiked');
            that.postState['likes']++;
            that.reqCurrentUser();
            callback && callback();
        }).catch((err) => {
            console.error(err);
        })
    },

    handleLikeEvent() {
        let that = this;
        $(document).on('click', '.js-zan', (e) => {
            e.preventDefault();
            let target = $(e.currentTarget);

            if(target.hasClass('isLiked')) {
                Toast('你已经点过赞了');
                return false;
            }

            this.reqLikeStatus(target);

        })
    }
};

handle.init();
export default handle;
