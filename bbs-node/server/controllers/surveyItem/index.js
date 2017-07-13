/**
 * 调查(设置页入口)
 * @qingtong
 */

'use strict';
const SurveyService = require('services/survey');

module.exports = function*() {

    const surveyId = this.query.id;
    const state = this.state;
    const env = state.env;

    const data = yield Promise.resolve().then(() => {

        if (!surveyId) {
            return Promise.reject();
        }

        const surveyService = new SurveyService(this);

        return Promise.props({
            surveyOption: surveyService.getSurveyOption(surveyId).then((ret) => {
                return ret.data;
            }).catch((e) => {
                this.log.error(e);
                return Promise.reject(e);
            })
        });
    }).then((ret) => {
        const surveyOption = ret.surveyOption || {};

        // 如果不存在问题，表示已全部回答完
        if(!surveyOption.question) {
            ret.error = '不存在该问题';
            return ret;
        }

        ret.pageTitle = surveyOption.question;
        return ret;
    });

    if(data.error) {
        yield this.render('error/index', { error: data.error });
    } else {
        yield this.render('surveyItem/index', data);
    }
};