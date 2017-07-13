module.exports = function (req) {
    return {
	    "code": 0,
	    "data": {
	        "newUserGift": {
	            "uid": 10001,
	            "taskId": 801582,
	            "taskType": 2,
	            "taskDesc": "新人礼50铜钱",
	            "copper": 50,
            	"activityTimeDesc": "领取时间：2017.06.07 - 2017.06.08",
	            "taskNote": "",
	            "isFinished": false,
	            "optDesc": "去领取",
	            "display": true
	        },
	        "dailyTasks": [
				{
	                "uid": 10001,
	                "taskId": 801580,
	                "taskType": 4,
	                "taskDesc": "修改个人资料(4项)",
	                "taskNote": "+50铜钱",
	                "isFinished": false,
	                "optDesc": "去修改"
				},
	            {
	                "uid": 10001,
	                "taskId": 801582,
	                "taskType": 2,
	                "taskDesc": "分享任一篇帖子给朋友们",
	                "taskNote": "+10铜钱",
	                "isFinished": false,
	                "optDesc": "去首页分享"
	            },
	            {
	                "uid": 10001,
	                "taskId": 801584,
	                "taskType": 3,
	                "taskDesc": "发篇帖子, 说说理财故事",
	                "taskNote": "+10铜钱",
	                "isFinished": false,
	                "optDesc": "去发帖"
	            },
				{
	                "uid": 10001,
	                "taskId": 801586,
	                "taskType": 5,
	                "taskDesc": "去锦囊提个理财问题",
	                "taskNote": "+30铜钱",
	                "isFinished": false,
	                "optDesc": "去提问"
				}
	        ]
	    }
	}
};
