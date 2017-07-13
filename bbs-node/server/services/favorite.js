'use strict';

const url = require('url');
const request = require('co-request');
const formatter = require('../lib/util/lib/formatter'); 

function Service(ctx) {
    const state = ctx.state;
    this.api = state.api;
    this.headers = ctx.headers;
    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {
    //查询收藏
    getMyFavlist(query){
        return this.request({
            url: this.api['favorite/get_my_favlist'],
            form: query
        }).then((ret) => {
            ret.data.forEach((list)=>{
                //显示行数
                if (list.title.length > 14) {
                    list.lineClamp = 2;
                } else {
                    list.lineClamp = 1;
                }
                list.likes = formatter.number2W(list.likes);
                list.replies = formatter.number2W(list.replies);
            });
            return ret;
        });
    }  
});

module.exports = Service;