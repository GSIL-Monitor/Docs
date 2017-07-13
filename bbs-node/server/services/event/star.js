/**
 * @overview 活跃之星
 * @author qingtong
 * @date 10/16/16
 */

'use strict';

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;

    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {
    getStarInfo(index) {
       return this.request({
            url: this.api['star/get_by_index'],
            form: { index }
        }).then((ret) => {
            return ret.data
        }); 
    },

    getRecommendUsers() {
       
    }
});

module.exports = Service;
