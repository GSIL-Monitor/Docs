var LessonService = require('services/lesson');

module.exports = function*() {
    this.body = yield Promise.resolve().then(() => {
    	const query = this.query;
        const lessonService = new LessonService(this);
        return lessonService.getList(query);
    });
};