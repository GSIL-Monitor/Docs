/**
 * @overview 铜钱服务
 * @author shushi
 * @date 3/23/16
 */

'use strict';

module.exports = class {

    constructor (ctx) {
      const { api, request } = ctx.state
      this.api = api
      this.request = request
    }

    // 获取铜钱账单
    getBillList(form) {
      const { lastId = null, size = 20 } = form
      return this.request({
        url: this.api['copper/app_get_op_list'],
        form: {
            lastId,
            size
        }
      }).then(ret => ret);
    }

}
