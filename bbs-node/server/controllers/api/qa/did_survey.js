var SurveyService = require('services/survey');

module.exports = function*() {
    const env = this.state.env;
    const tagId = (env == 'staging' || env == 'production') ? 20001 : 20004;
    this.body = yield Promise.resolve().then(() => {
        const surveyService = new SurveyService(this);
        return surveyService.getSurveyList(tagId);
    });
};