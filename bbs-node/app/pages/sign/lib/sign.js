import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Countdown from '../components/Countdown'
import classNames from 'classnames';
import request from 'request';
import toast from '@wac/toast';
import { Toast, panel, Group, Cell, Nav as XNav } from '@wac/react-ui';
import url from 'url';
import util from '@finance/util';
import {
  connect,upward
} from '@wac/bridge-utils';

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
     const vconsole = require('vconsole');
} 

const {
	Panel,
	PanelHeader,
	PanelBody,
	PanelFooter
} = panel;

import Modal from 'react-modal';

const rank = require('../image/rank.png')
const bill = require('../image/bill.png')
const store = require('../image/store.png')
const gift = require('../image/gift.png')

const { signInfo = {}, userTaskList = {}, isQianTangApp, isQianTang, isWacai, platform, deviceid }= window.__INITDATA__;
const Icon = (src) => (
  <img src={src} className="responsive" />
);

// 公共埋点方法
const dataStat = (evt, ...options) => {
	Stat.send('stat', {
        evt,
        deviceid,
        platform,
        ...options
    });
}

const parsed = url.parse(location.href, true, true);

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    width: '84%',
    padding: 0,
	maxWidth: '30rem',
    border: 'none',
    background: 'none',
    borderRadius:'none',
    transform : 'translate(-50%, -50%)'
  },
  overlay: {
  	backgroundColor: 'rgba(0,0,0,0.6)'
  }
};

const noop = () => {};
// 任务的映射表
const taskMap = new Map();
// 新人任务
taskMap.set(1, {});
// 发帖任务
taskMap.set(2, {
	link: 'nt://sdk-bbs2/post',
	handler: async _ => {
		// 点击发帖任务埋点
		dataStat('sign_task_post');
		connect(async bridge => {
			try {
				const isSupport = await bridge.ping('nt://sdk-bbs2/post');
				if (isSupport) {
					window.location = `nt://sdk-bbs2/post?need_login=1`;
					return false;
				} else {
					bridge.bbsForumDiscuss({
						type: 3,
						plateID: ''
					})
				}
			} catch (e) {}
		})
	}
})
// 回首页分享任务
taskMap.set(3, {
	link: null,
	handler: _ => {
		dataStat('sign_task_share');
		window.location = 'wacai://close';
	}
});
// 修改个人资料任务
taskMap.set(4, {
	link: 'nt://sdk-bbs2/personalProfile',
	handler: async _ => {
		dataStat('sign_task_personaldata');
		window.location = 'nt://sdk-bbs2/personalProfile?need_login=1&need_zinfo=1'
	}
});
// 锦囊提问任务
taskMap.set(5, {
	link: 'nt://sdk-bbs2/jinnang',
	handler: async _ => {
		dataStat('sign_task_ask');
		const res = await request({
			method: 'get',
			url: '/qa/did_survey'
		})
		console.log(res)
		if (res.data.didSurvey) {
			window.location = 'nt://sdk-bbs2/askQuestion?need_login=1&need_zinfo=1';
		} else {
			window.location = '/app/survey?popup=1&need_zinfo=1&need_login=1';
		}
	}
});

class Sign extends Component {
	constructor() {
	    super();
	    this.state = {
	      modalIsOpen: false, // 弹窗
	      isSign: signInfo.isSign, // 是否签到
	      copperCount: signInfo.copperCount || 0, // 总铜钱数
	      dayCount: signInfo.continueSignDay || 0, // 签到天数
	      userTaskList: {},  //
	      // 新人礼
	      newUserGiftFinish: userTaskList.newUserGift && userTaskList.newUserGift.isFinished,
	    };
	    this._bindFunctions();

	    this.init();
	}

	// private 绑定方法的this
	_bindFunctions () {
		[
			'afterOpenModal',
			'closeModal',
			'onSign',
			'onUserGift',
			'onCellClick',
			'gotoJishi',
			'onNavBack',
			'lazyStat',
			'toRulePage'
		].map(funcName => {
			this[funcName] = this[funcName].bind(this)
		})
	}

	lazyStat(evt){
		return () => {
			dataStat(evt);
		}
	}

	updateUserTaskList(){
		request({
	        method: 'post',
	        url: '/member/get_user_taskList',
	        data: {
            	deviceid
            }
	    }).then(res => {
			this._setTasks(res.data)
	    })
	}

	// 过滤任务列表 去掉当前版本不支持的任务
	_filterTasks (tasks) {
		const arr = []
		tasks.forEach(item => {
			arr.push(new Promise(async resolve => {
				const { taskType } = item;
				if (!taskMap.has(taskType)) resolve(null);
				const taskInfo = taskMap.get(taskType);
				if (!taskInfo.link) {
					resolve({
						...item,
						...taskInfo
					})
				}
				try {
					await this._isSupportUrl(taskInfo.link)
					resolve({
						...item,
						...taskInfo
					})
				} catch (error) {
					resolve(null)
				}
			}))
		})
		// connect为异步操作 使用Promise.all等所有都完成再进行下一步操作
		return Promise.all(arr)
	}

	// 判断是否支持某个url跳转的promise
	_isSupportUrl (url) {
		return new Promise((resolve, reject) => {
			connect(async bridge => {
				try {
					const isSupport = await bridge.ping(url)
					isSupport ? resolve(true) : reject()
				} catch (e) {
					reject()
				}
			})
		})
	}

	init(){
		// 集市返回回调
		window.wacClient_callback = () => {
		    // const parsed = url.parse(location.href, true, true);

		    // const query = parsed.query;
		    // query.need_zinfo = 1;

		    // delete parsed.search;
		    // const urlParsed = parsed.format();
		    //window.location.href = urlParsed
		    setTimeout(() => {
		    	request({
			        method: 'get',
			        url: '/member/get_sign_info',
			    }).then(res => {
			    	const { copperCount } = res.data;
			    	this.setState({
			    		copperCount
			    	})
			    })

			    this.updateUserTaskList();
		    }, 1000)
		};

		// 调用埋点方法 pv
		dataStat('sign_page');
		this.initJsBridge();
		// 设置过滤后的tasks
		console.log(userTaskList.dailyTasks)
		this._setTasks({
			dailyTasks: userTaskList.dailyTasks,
			newUserGift: this.state.userTaskList.newUserGift
		});
		if (isQianTangApp && userTaskList.newUserGift && userTaskList.newUserGift.display) {
		// 新人礼展示埋点
		dataStat('sign_usergift_show');
		}
	}

	_setTasks (taskObj) {
		const { dailyTasks, newUserGift } = taskObj;
		console.log(dailyTasks)
		// 过滤tasks
		this
		._filterTasks(dailyTasks)
		.then(res => {
			console.log(res)
			this.setState({
				userTaskList: {
					dailyTasks: res,
					newUserGift	
				}
			})
		});
	}

	onSign(e){
		e.preventDefault();
		const target = $(e.currentTarget);

		// 签到埋点
		dataStat('sign_button');

        request({
            method: 'post',
            url: '/member/sign'
        }).then((ret) => {
        	if(ret.code == 0){
        		this.setState({
	            	isSign: true,
	            	copperCount: this.state.copperCount+ret.data,
	            	dayCount: this.state.dayCount+1
	            })

	            return;
        	}
            
            toast(ret.error || '无可用网络连接，请检查后重试');

            
        }).catch(err => {
        	toast('无可用网络连接，请检查后重试')
        })
	}

	initJsBridge() {
		const mixin = {
			bbsForumDiscuss(params) {
				const isSupport = {
					action: 'isSupport',
					params: {
						method: 'forumDiscuss'
					}
				}

				this.send(JSON.stringify(isSupport), support => {
					if (support) {
						const action = {
							action: 'forumDiscuss',
							params
						};
						// 版本兼容.....
						location.href = `wacai://forumdiscuss?type=${params.type}`;
						//this.send(JSON.stringify(action));
					} else {
						location.href = `wacai://forumdiscuss?type=${params.type}`;
					}
					return Promise.resolve()
				})
			} 
		};

		upward(mixin);
 
  }

	onUserGift(e){
		e.preventDefault();
		const target = $(e.currentTarget);

		//点击领取新人礼埋点
		dataStat('sign_usergift_receive');

		request({
            method: 'post',
            url: '/member/do_copper_task',
            data: {
            	taskType: target.data('tasktype'),
            	deviceid
            }
        }).then((ret) => {
        	if(ret.code == 0){
        		let copperCount;
        		if(ret.data.first){

        			this.setState({modalIsOpen: !this.state.modalIsOpen});
        			copperCount = this.state.copperCount+ret.data.copper;
        		} else {
        			copperCount = this.state.copperCount;
        		}
        		this.setState({
	            	newUserGiftFinish: true,
	            	copperCount,
	            })

	            return;
        	}
            
            toast(ret.error || '无可用网络连接，请检查后重试');            
        }).catch(err => {
        	toast('无可用网络连接，请检查后重试')
        })
	}

	onCellClick(task){
		return () => {
			if (task.isFinished) return false;
			task.handler(); // 调用处理函数
		}
	}

	// 点击跳转集市
	gotoJishi(){
		if(!util.isApp()) return;
		//集市埋点
		dataStat('sign_usergift_receive');
		window.location = '/m/member/jishi?need_login=1&navTitle=集市兑换&popup=1';
		this.setState({modalIsOpen: false});
		return false;
	}

	onNavBack(){
		window.location = 'wacai://close';
	}

	// 跳转到规则界面
	toRulePage () {
		window.location = '//site.wacai.com/page/3406?popup=1';
	}

	afterOpenModal() {
	    
	}

	closeModal() {
	    this.setState({modalIsOpen: false});
	}

	render(){
		// 签到classList
		const ButtonClass = classNames(
			'sign__Button', 
			{'disabled': this.state.isSign}, 
		);

		// 新人礼classList
		const NewUserClass = classNames(
			'media-button', 
			{'disabled': this.state.newUserGiftFinish}, 
		);

		// 自定义navclass
		const customNavClass = classNames(
			'customNav',
			{'isAndroid': util.isAndroid(),'isIOS': util.isIOS()}
		);

		// 自定义nav: 
		// + 在挖财里面, 如果不是钱堂(包括sdk), 展示自定义nav
		// + 在挖财里面，如果是钱堂(包括sdk)，并且取的到bbsWaxVersion, 展示自定义nav
		const showCustomNav = !!(isWacai && (!isQianTang || parsed.query.bbsWaxVersion));
		// const showCustomNav = true;
		const couterClass = classNames(
			'm-container counter',
			{'isIOS': util.isIOS() && showCustomNav }
		);

		const { dailyTasks = {}, newUserGift = {} } = this.state.userTaskList;
		const jsLink = () => {
			if(!util.isApp()) return 'javascript:;';
			return '/m/member/jishi?need_login=1&popup=1&navTitle=集市兑换';
		}

		const titleComp = `<span>已连续签到</span>`;
		return (
			<div>
				{
					showCustomNav ?
						<XNav 
							className={ customNavClass } 
							title={ titleComp } 
							rightOptions={ { showMore: true } }
							onClick={ this.onNavBack }
							onClickMore={ this.toRulePage } />
						:
						null
				}
				
				<div className={couterClass}>
					<Countdown start={ this.state.dayCount }/>
					<div className='sign__info'>
				        <div className="copper">
				            <span className="copper-item">铜钱数&nbsp;
				            <em className="copperHighLight">{ this.state.copperCount || 0 }</em></span>
				            {
				            	this.state.isSign ? 
				            		<span className="copper-item">
							            明日签到&nbsp; <em className="copperHighLight">+{ signInfo.tomorrowCopper || 5 }铜钱</em>
							        </span>
							         :
							        <span className="copper-item">
							            今日签到&nbsp; <em className="copperHighLight">+{ signInfo.todayCopper || 5 }铜钱</em>
							        </span>
				            }
				        </div>
				        <a href="javascript:;" 
				        	className={ButtonClass} 
				        	onClick={!this.state.isSign && this.onSign}
				        >
				        	{ this.state.isSign ? '已签到':'立即签到' }
				        </a>
				    </div>
				    <div className="backbg"></div>
				</div>

				<div className="link__items flex">
				    	<div className="link__item f1 wux-center">
				    		<a href="/app/member/ranking?popup=1" className="home-rank-list sign_link_item" onClick={this.lazyStat('sign_ranking')}>
					    		{Icon(rank)}
					    		<p>排行榜</p>
				    		</a>
				    	</div>
			    	<div className="link__item f1 wux-center">
			    		<a href={jsLink()} className="home-jishi sign-link-item" onClick={this.lazyStat('sign_jishi')}>
				    		{Icon(store)}
				    		<p>集市兑换</p>
			    		</a>
			    	</div>
			    	<div className="link__item f1 wux-center">
			    		<a href="/app/copper/bill?need_login=1&popup=1" className="home-signBill sign-link-item" onClick={this.lazyStat('sign_bill')}>
				    		{Icon(bill)}
				    		<p>铜钱账单</p>
			    		</a>
			    	</div>
			    </div>

			    { isQianTangApp && newUserGift && newUserGift.display ?
				    <Panel className="newBieGift">
				    	<PanelHeader>
				    		<div>新手礼</div>
				    	</PanelHeader>
				    	<PanelBody>
				    		<div className="flex flex-between wux-center-v wingBlank">
				    			<div className="media">
					    			<div className="media-title c2" dangerouslySetInnerHTML={{__html: newUserGift.taskDesc}}>
					    			</div>
					    			<p className="media-desc c3 ellipsis">{newUserGift.activityTimeDesc}</p>
				    			</div>
				    			<a 	href="javascript:;" 
				    				data-tasktype={newUserGift.taskType}
				    				className={NewUserClass}
				    				onClick={!this.state.newUserGiftFinish && this.onUserGift}
				    			>
				    				{ this.state.newUserGiftFinish ? '已领取':'去领取' }
				    			</a>
				    		</div>
				    	</PanelBody>
				    </Panel>
				    	:
				    null
				}
				{ this._renderDailyTask(dailyTasks) }
			    <Modal
		          isOpen={this.state.modalIsOpen}
		          onAfterOpen={this.afterOpenModal}
		          onRequestClose={this.closeModal}
		          style={customStyles}
		          contentLabel="Example Modal"
		        >

		          <div className="dialogWrapper signModal">
		          	<div className="sign__card">
		          		<div className="card__header">
		          			<div className="giftWrapper">
		          				{Icon(gift)}
		          			</div>
		          		</div>
		          		<div className="card__body">
		          			<h4 className="c1">领取成功！获得&nbsp;<em className="sign__copper">{newUserGift.copper}</em>&nbsp;铜钱</h4>
		          			<p className="c2 f14 copper_desc">铜钱是钱堂的通用货币，可以在集市兑换礼品</p>

		          			<div className="sign__card__btn btn-primary btn-block js-jishi" onClick={this.gotoJishi}>去看看能换点什么</div>
		          		</div>
		          	</div>
		          	<a href="javascript:;" className="closeIcon" onClick={this.closeModal}></a>
		          </div>
		        </Modal>

		    </div>
		)
	}

	// 渲染每日任务模块
	_renderDailyTask (tasks) {
		return tasks.length
		? (<Panel className="dailyTask">
				<PanelHeader>
					<div>每日任务</div>
				</PanelHeader>
				<PanelBody>
					<Group>
						{ 
							tasks.map((task, index) => {
								if (!task) return null;
								return(
									<Cell key={ index }
										inlineDesc={ `${task.taskNote || ''}` }
										title={ task.taskDesc } 
										value={ task.isFinished ? '已完成': `<span class="span">${task.optDesc}</span>` }
										link={ task.isFinished ? null : task.link }
										onCellClick={ this.onCellClick(task) }
									/>
								)
							})
						}	
					</Group>
				</PanelBody>
			</Panel>)
		: null
	}
}

export default Sign;