import request from 'request';
import util from '@finance/util';
import Velocity from 'velocity-animate';
import Vue from 'vue';
import post from '../index';

const likerTpl = require('../tpl/liker.html?tpl');

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
     const vconsole = require('vconsole');
}

const handle = {
    init() {
        this.state = {
            likers:  window.__INIT_DATA__.likeList
        };
        this.initState();
        this.handler();
        this.bindEvents();
    },

    initState() {
        this.postState = new Vue({
            el: '#js-handle-wrapper',
            components: {
            },
            data() {
                return {
                    like: window.__INIT_DATA__.stats.like,
                    fav: window.__INIT_DATA__.stats.fav,
                    likes: window.__INIT_DATA__.stats.likes
                };
            },
            ready() {
            }
        });
    },

    reqCurrentUser(userStatus) {
        let that = this;
        request({
            url: '/member/get_currentuser_info'
        }).then((ret) => {
            if (ret.code != 0) return; 
            // 更新头像
            // 点赞
            if (!!userStatus) {
                that.state.likers.unshift({
                    avatarUrl: ret.data.userHead,
                    uid: ret.data.uid
                });
            } else {
                // 取消点赞
                let _index;
                // 判断当前用户是否在底下点赞头像中
                const hasSelf = that.state.likers.find((ele, index) => {
                    if(ele.uid == ret.data.uid) {
                        _index = index;
                        return true;
                    }else{
                        return false;
                    }
                });
                // 如果已经在名单中，需要把自己取消
                if (!!hasSelf) {
                    that.state.likers.splice(_index, 1);
                } else {

                }
            }       

            that.state.likers = that.state.likers.slice(0, 8);
            that.renderLikerList(that.state.likers);
        }).catch((err) => {
            console.log(err);
        });
    },

    renderLikerList(data) {
        let that = this;
        $('.post-fav-row').empty().append(likerTpl.render({
            items: data
        }));
    },

    reqLikeStatus(btn, type, callback) {
        let that = this;

        let url = type == 'like' ? '/item/like_opt' : '/item/fav_opt';
        request({
            url: url,
            method: 'post',
            data: {
                tid: util.getUrlQuery('tid')
            }
        }).then((ret) => {
            that.postState[type] = !that.postState[type];

            // 更新点赞人数
            if(type == 'like') {
                if(!!that.postState[type]){
                   that.postState['likes']++;
                }else{
                    that.postState['likes'] > 0 && that.postState['likes']--;
                }

                // 更新头像列表
                that.reqCurrentUser(that.postState[type]);

                // 更新点赞状态
                post.isSupportBottomShare((isSupport) => {
                    if (!isSupport) return;
                    post.showBottomShareFeature(that.postState[type]);
                })
            } else {
                // 同步更新menu收藏状态
                post.state.stats.fav = that.postState[type];
                post.renderMoreMenu();
            }

            callback && callback();
        }).catch((err) => {
            console.error(err);
            btn.removeClass('flag');
        })
    },

    handler() {
        let that = this;
        $(document).on('click', '.js-btn', (e) => {
            e.preventDefault();
            let target = $(e.target).closest('.js-btn');
            const type = target.attr('type');

            if(target.hasClass('flag')) return;
            target.addClass('flag');

            this.reqLikeStatus(target, type, this.toggleStatus.bind(that, target));

        })
    },

    toggleStatus(target) {
        let btn1 = target.find('.icon');
        let btn2 = target.find('.icon').clone().appendTo(target.find('.iconWrap'));

        target.toggleClass('active');
        Velocity(btn2, {
            scaleX: [2.0, 0],
            scaleY: [2.0, 0],
            opacity: [0, 1]
        }, {
            duration: 600,
            easing: 'ease-out',
            complete: () => {
                btn2.remove();
                target.removeClass('flag');
            }
        });
    },


    bindEvents() {
        const el = $(document);
        var that = this;
        const EVENTS = {
            
        };

        $.each(EVENTS, (selector, events) => {
            $.each(events, (type, handler) => {
                el.on(type, selector, handler.bind(this));
            });
        });
    }
};

handle.init();
export default handle;
