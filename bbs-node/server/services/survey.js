'use strict';

const url = require('url');
const request = require('co-request');

function Service(ctx) {
    const state = ctx.state;
    this.api = state.api;
    this.headers = ctx.headers;
    this.request = state.request;
    this.env = state.env;
}

Object.setPrototypeOf(Service.prototype, {
    // 公开课首页接口
    getSurveyList(tagId) {
        return this.request({
            url: this.api['qa/did_survey'],
            form: {tagId:tagId}
        }).then((ret) => {
            return ret;
        });
    },

    saveAnswer(survey){
        return this.request({
            url: this.api['qa/save_survey_answer'],
            form: {survey:survey}
        }).then((ret) => {
            return ret;
        });
    },

    getSurveyOption(id){
        return this.request({
            url: this.api['qa/get_survey_options'],
            form: {guideQuestionId:id}
        }).then((ret) => {
            return ret;
        });
    },

    updateAnswer(guideQuestionId='', guideAnswerIds=''){
        return this.request({
            url: this.api['qa/update_survey_answer'],
            form: {guideQuestionId,guideAnswerIds}
        }).then((ret) => {
            return ret;
        });
    },
});

module.exports = Service;
