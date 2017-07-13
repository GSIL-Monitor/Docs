/**
 * @overview 新人引导
 * @author longyun
 * @date 7/28/16
 */

'use strict';

const chunk = require('lodash/chunk');
const labels = require('data/recommend-labels');
const official = require('data/recommend-users');

function Service(ctx) {
    const state = ctx.state;

    this.api = state.api;
    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {
    getLabels() {
        const specLabels = labels(this.env);

        return this.request({
            url: this.api['guide/get_tags']
        }).then((ret) => {
            const tags = ret.data || [];

            return specLabels.map((labelItem) => {
                const list = labelItem.list;

                list.forEach((item) => {
                    const isInclude = tags.some((fid) => {
                        if (parseInt(item.fid, 10) === fid) {
                            return true;
                        }
                    });

                    if (isInclude) {
                        item.checked = true;
                    }
                });

                labelItem.list = chunk(list, 3);

                return labelItem;
            });
        });
    },

    getRecommendOfficial() {
        const recommendOfficial = official(this.env);
        return recommendOfficial;
    },
    getRecommendUser() {
        return this.request({
            url: this.api['guide/get_guide_list'],
        }).then((ret) => {
            return ret;
        });
    }
});

module.exports = Service;
