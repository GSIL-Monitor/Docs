<template>
  <div>
  <div id="app">
    <div class="tabBar followTabBar">
      <tab v-cloak :index="curIndex" :active-color="activeColor" :line-width="2">
        <tab-item  v-for="(list,index) in followList" :selected="index==curIndex" :key="index"
          @on-item-click="onItemClick"
        >
            {{ list.name }}
        </tab-item>
      </tab>
    </div> 

    <tab-content v-cloak :index="curIndex">
        <tab-content-item v-for="(list,index) in followList" 
          :active-index="curIndex"
          :tab-index="index"
          :key="index"
          >
          <div class="tab-content" :class='{"fansTab": index == 0, "attentionTab":index == 1}'>
             <div class="followItem flex wux-center-v" v-for="(item,itemIndex) in list.list" :key="itemIndex" :uid="item.uid">
              <div class="avatar" :style="{backgroundImage: 'url(' + item.avatarUrl + ')'}">
                <i class="icon verify" v-if="item.verify"></i>
              </div>
              <div class="f1 contentRow w0">
                <h3 class="nameRow ellipsis">{{ item.username }}</h3>
                <div class="bottomRow f1">
                  <span v-if="item.followerNum > 0">关注:{{ item.followerNum }}&nbsp;</span>
                  <span>粉丝:{{ item.fansNum }}</span>
                </div>
              </div>
              <a href="javascript:;" :type="index" :index="itemIndex" :uid="item.uid" class="btn btn-primary outlined round js-follow eq-wh" v-if="item.mutual == -1">关注</a>
              <a href="javascript:;" :type="index" :index="itemIndex" :uid="item.uid" class="btn btn-primary outlined round js-follow eq-wh  followed" v-if="item.mutual == 0">已关注</a>
              <a href="javascript:;" :type="index" :index="itemIndex" :uid="item.uid" class="btn btn-primary outlined round js-follow followed" v-if="item.mutual == 1">相互关注</a>
              <span class="wux-1px-b">&nbsp;</span>
             </div>
        
        <div class="listViewDone" v-if="list.pager > 1 && list.currentList.length < PAGESIZE">
              <span class="wux-divider"><span>我是有底线的</span></span>
        </div>    
        
        <div class="emptyView" v-if="list.list.length == 0 && !loading" v-cloak>
            <span class="imageWrap">
                <img src="~common/img/blank.png" class="responsive">
            </span>
            <div class="emptyTxt" v-if="index == 1" v-cloak>还没有关注财友呢</div>
            <div class="emptyTxt" v-cloak v-else>还没有粉丝呢</div>
        </div>

          </div>
        </tab-content-item>
    </tab-content>
    </div>
    
    <toast ref="Toast" :show="loading" :type="toast.type" :time="toast.time">
     <span v-text="toast.content" slot></span>
    </toast>
  </div>
</template>

<script>
import url from 'url';
import Toast from 'vue/toast'
import {Tab, TabItem} from 'vue/tab'
import {TabContent, TabContentItem} from 'vue/tab-content'
import request from 'request';
import {throttle} from 'lodash';

const parsed = url.parse(location.href, true, true);
const followList = [
    {
        name: '粉丝',
        list: [],
        currentList: [],
        loadAll: false,
        pager: 1
    },
    {
        name: '关注',
        list: [],
        currentList:[],
        loadAll: false,
        pager: 1
    },
]

const INIT_DATA = window.__INIT_DATA__ || {};
const PAGESIZE = 15;

const APP = {
    resetFollow(){
        request({
            method: 'POST',
            url: '/message/reset_follow'
        }).then((res) => {
            if (res.code == 0 && res.data) {
            } else {
                return Promise.reject();
            }
        }).catch(() => {
        });
    },
    bindScroll(ref) {
        let lastScrollTop;

        const el = $(document);
        const body = document.body;

        el.on('scroll', throttle((e) => {
            const scrollTop = body.scrollTop;
            if (scrollTop - lastScrollTop >= 0 && scrollTop + window.innerHeight * 2 >= body.scrollHeight && !ref.followList[ref.curIndex].loadAll) {

                ref.followList[ref.curIndex].pager++;
                ref.requestData(ref.curIndex)
            }

            lastScrollTop = scrollTop;
        }, 200));
    },

    bindEvents(ref) {
        const el = $(document);

        const EVENTS = {
            '.js-follow': {
                click: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const target = $(e.currentTarget);
                    const uid = target.attr("uid");
                    const hasFollowed = target.hasClass('followed');
                    const type = parseInt(target.attr('type'));
                    const index = parseInt(target.attr('index'));

                    request({
                        method: 'post',
                        data: { uid },
                        url: hasFollowed ? '/member/unfollow' : '/member/follow'
                    }).then((ret) => {
                        const data = ret.data;

                        console.log(index);

                        let currentRow = ref.followList[type].list[index];
                        
                        console.log(currentRow);

                        // 如果未关注，获取服务端关注状态
                        // 否则未关注
                        if(typeof data.mutual != 'undefined'){
                            currentRow.mutual = data.mutual;
                        }else{
                            currentRow.mutual = -1;
                        }
                        
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            },

            '.followItem': {
                click: (e) => {
                    e.preventDefault();
                    const target = $(e.currentTarget);
                    const uid = target.attr('uid');
                    window.location = `/app/home?need_zinfo=1&popup=1&uid=${uid}&navTitle=个人主页`;
                }
            }
        };

        $.each(EVENTS, (selector, events) => {
            $.each(events, (type, handler) => {
                el.on(type, selector, handler.bind(this));
            });
        });
    }
};

export default {
  components: {
      Toast,
      Tab,
      TabItem,
      TabContent,
      TabContentItem
  },
  data() {
      return {
          toast: {
              type: 'loading',
              content:'加载中....'
          },
          activeColor: '#ff4d58',
          loading: true,
          PAGESIZE: 15,
          followList,
          curIndex: INIT_DATA.fans ? 0 : 1,
      };
  },
  methods: {
        onItemClick(index) {

            this.curIndex = index;

            const currentList = this.followList[index];

            if(currentList.list.length || currentList.loadAll || currentList.pager > 1) return;
            this.loading = true;
            this.requestData(index);
        },

        requestData(type = 0) {
            const url = type == 0 ? '/follow/fans': '/follow/follower';

            const data = this.uid ? 
                {uid: this.uid, currPage: this.followList[type].pager}
                :
                {currPage: this.followList[type].pager}

            return request({
                url,
                method: 'post',
                data
            }).then(res => {
                this.loading = false;
                const listData = res.data;
                const currentFollowList = this.followList[type];

                // 最新条目
                currentFollowList.currentList = listData;

                // 是否加载完毕
                if(listData.length < PAGESIZE){
                    currentFollowList.loadAll = true;
                }

                if(currentFollowList.pager == 1){
                    currentFollowList.list = listData;
                }else if(listData.length){
                    currentFollowList.list = currentFollowList.list.concat(listData);
                }
            })
        },
    },
    mounted() {
        let startTime = new Date();
        this.uid = parsed.query.uid || '';

        function setRequestCallback(){
            let requestTime = (new Date() - startTime)/1000;
            if(requestTime < 400) {
                setTimeout(() => {
                    this.loading = false;
                }, 400 - requestTime)
            }
        }

        this.requestData(this.curIndex).then(ret => {
            setRequestCallback.call(this);
        })
       
        APP.resetFollow();
        APP.bindEvents(this);
        APP.bindScroll(this);
    }
}
</script>