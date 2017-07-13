module.exports = {
	//公开课banner接口
	'lesson/get_banners': {
        server: {
            test: "http://api.test.wacai.info/",
            staging: "http://basic.wacai.com/",
            production: "http://basic.wacai.com/"
        },
        path: "basic-biz/banners/list"
    },
	// 公开课首页接口
	'lesson/get_index_list': 'lesson/get_index_list',
	//公开课列表页接口
	'lesson/get_list': 'lesson/get_list',
	//查询每个分类下的课程数量接口
	'lesson/get_find_list': 'lesson/get_find_list',

	// 关注粉丝列表
	// 查询关注数
	'follow/follower': 'follow/follower',
	'follow/fans': 'follow/fans',
	'qa/did_survey': 'qa/did_survey',
	'qa/save_survey_answer': 'qa/save_survey_answer',
	'qa/get_survey_options':'qa/get_survey_options',
	'qa/update_survey_answer':'qa/update_survey_answer',

	// 新版外部详情页
	'post/recommend_post': 'post/get_out_recommend_post',
	'sdk/update': 'switch/rec_app_download',


	//帖子详情页投票
	'vote/do_vote_option': 'vote/do_vote_option',

	// 用户任务状态
	'member/user_task_list': 'coppertask/user_task_list',
	'member/do_copper_task': 'coppertask/do_copper_task',

	// 首页推荐问题
	'qa/get_recommend_question': 'qa/get_recommend_question',

	// 飘带入口
	'piaodai/get_active' : 'piaodai/get_active',

	// 铜钱账单
	'copper/app_get_op_list': 'copper/app_get_op_list'
}