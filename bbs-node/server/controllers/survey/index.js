/**
 * 调查
 * @qingtong
 */

'use strict';
const SurveyService = require('services/survey');
const urlParse = require('url').parse;

module.exports = function*() {

    const platform = this.query.platform || 71;
    const state = this.state;
    const env = state.env;

    const tagId = (env == 'staging' || env == 'production') ? 20001 : 20004;


    const data = yield Promise.resolve().then(() => {
        const surveyService = new SurveyService(this);

        return Promise.props({
            surveyList: surveyService.getSurveyList(tagId).then((ret) => {
                return ret.data;
            }).catch((e) => {
                this.log.error(e);
            })
        });
    }).then((ret) => {
        const surveyList = ret.surveyList || {};
        const isValid = surveyList.questions && surveyList.questions.length > 0;
        if(isValid){
            ret.percent = 100 / surveyList.questions.length;
        }else{
            ret.percent = 100;
        }
        
        ret.INIT_DATA = {
            didSurvey: !!surveyList.didSurvey,
            count:  isValid ? surveyList.questions.length : 0,
            questions: surveyList.questions
        }
        return ret;
    });
 
    let error = '';

    if(data.INIT_DATA.didSurvey) {
        error = '您已完成理财调查';
    }

    if (error) {
        yield this.render('error/index', {error: error});
    } else {
        yield this.render('survey/index', data);
    }
	
};