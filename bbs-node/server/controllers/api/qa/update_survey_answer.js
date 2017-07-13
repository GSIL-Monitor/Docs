var SurveyService = require('services/survey');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
        const {guideQuestionId, guideAnswerIds} = this.request.body;

        const surveyService = new SurveyService(this);
        return surveyService.updateAnswer(guideQuestionId, guideAnswerIds);
    });
};