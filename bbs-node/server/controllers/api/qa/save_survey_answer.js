var SurveyService = require('services/survey');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const {survey} = this.request.body;

        const surveyService = new SurveyService(this);
        return surveyService.saveAnswer(survey);
    });
};