/**
 * @overview
 * @author cisong
 * @date 1/27/16
 */

import reqwest from 'reqwest';
import Toast from '@wac/toast';
import escapeHtml from 'escape-html';
import { doLogin } from 'login';

function request(options) {
    let url;
    if(options.isOldApi){
        url = '/api' + options.url;
    }else{
        url = '/app/api' + options.url;
    }
    options = Object.assign({
        type: 'json'
    }, options, {
        url: url
    });

    return new Promise((resolve, reject) => {
        reqwest(options).then((ret = {}) => {
            if (ret.code == 4008 || ret.code == 5004 || ret.code == 5005) {
                return doLogin();
            }

            if (ret.code != 0) {
                // 领取铜钱接口特殊处理
                if(options.url.includes('do_copper_task')){

                }else{
                    Toast(escapeHtml(ret.error) || '接口异常');
                }
                return reject(ret);
            }

            resolve(ret);
        }, (err) => {
            reject(err);

            if (err instanceof XMLHttpRequest) {
                // return Toast('网络异常, 请稍后重试');
            }
        });
    });
}

export default request;
