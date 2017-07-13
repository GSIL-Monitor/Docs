/**
 * @overview 个人主页
 * @author qingtong
 * @date 1/22/16
 */

function Service(ctx) {
    const state = ctx.state;
    this.headers = ctx.headers;
    this.api = state.api;
    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {

	homePage(uid) {
		return this.request({
            url: this.api['home/person_page'],
            form: {uid}
        }).then((ret) => {
            let data = ret.data || {};
            let tags = data.tags || [];

            if(tags.length){
                tags.forEach((tag) => {
                    if(!tag.icon){
                        tag.icon = '//s1.wacdn.com/wis/126/8a4bb0c62ccc42c1_142x142.png';
                    }
                })
            }

            return ret;
        });
	},

    getMorePost(query) {
        return this.request({
            url: this.api['home/more_post'],
            form: query
        }).then((ret) => {
            const data = ret.data;
            if(data && data.length) {
                data.forEach((el) => {
                    el.uid = query.uid;
                })
            }

            return ret;
        });
    }

});

module.exports = Service;