/**
 * 锦囊数据model
 * @author qingtong
 * @date 4/12/17
 */

'use strict';

const url = require('url');
const request = require('co-request');
const urlParse = require('url').parse;
const urlResolve = require('url').resolve;
const JinnangService = require('services/jinnang');
const _ = require('lodash');

function* Service(ctx, platform) {
    const data = yield Promise.resolve().then(() => {
        const jinnangService = new JinnangService(ctx);

        return Promise.props({
            banners: jinnangService.getBanners(platform).then((ret) => {
                return ret.banners;
            }).catch((e) => {
                ctx.log.error(e);
            })
        });
    }).then((ret) => {
        return ret;
    });

    return {
        code: 0,
        data: data
    }

};

module.exports = Service;
