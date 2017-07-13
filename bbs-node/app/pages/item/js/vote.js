import React, {Component } from 'react'
import PropTypes from 'prop-types';
import Radio from './radio'
import CheckBox from './checkbox'
import request from 'request';
import { connect } from '@wac/bridge-utils';
import Toast from '@wac/toast';
import classNames from 'classnames';
import dataStat from '../../../components/stat';
import util from '../../../components/formatter';

// bar最长比例
const BAR_WIDTH = .82;

// 颜色
const COLOR = {
    blue: "rgb(126, 169, 217)"
}

// alphaBase
const alphaBase = 4;
const alphaStep = 2;
const alphaMaxCount = 3;

export default class Vote extends Component {

    static propTypes = {
    	InitData: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = this.transformData(this.props.InitData);
    }

    //初始化多选的checked属性
    componentWillMount(){
        $('#vote-area-container').removeClass('preload');
    	if(this.props.InitData.type == 2){
    		let optionList=this.props.InitData.optionList.map(option =>
			         Object.assign(option, {checked:false})		
			)
			this.setState({'optionList':optionList});
	    }
    }

    //多选时点击投票按钮
    handleVoteClick= (e) =>{
        //确保满足多选投票条件
        dataStat("threaddetail_vote_logged_in");
        let judge = this.state.optionList.some((option) => (option.checked == true));
        if(!judge){Toast('请先选择，再投票');}
        else{
            let optionList=[];
            this.state.optionList.forEach((option)=>{
                if(option.checked){optionList.push(option.id);}
            })
            let voteObj = {
                voteId:this.props.InitData.id,
                optionIdList:optionList.join(',')
            };
            this.sendVoteToService(voteObj);
        }
    }

    //多选时点击选项
    handleCheckBoxClick= (e) =>{
        let index =e.currentTarget.getAttribute('data-index');
        
    	dataStat("threaddetail_vote_logged_in");
        if(this.state.voted){return;}
        let optionList = this.state.optionList;
        if(optionList[index].checked){optionList[index].checked = false;}
        else{optionList[index].checked = true;}
        this.setState({optionList: optionList});
        
    }

    transformData(data){
        let { optionList = [], voteCount = 0,voted  } = data;

        if(voted){
            //封装显示数据(js小数点算法问题)
            let alpha = 10;
            let sumNum = 0;
            //复制并按从大到小排序
            let copyOptionList = optionList.slice(0).filter(v => !!v.voted);

            copyOptionList.sort((option1,option2) =>{
                if(!option1.voteCount){option1.voteCount =0}
                if(!option2.voteCount){option2.voteCount =0}
                return option2.voteCount - option1.voteCount;
            })

            // step递减,最大为3
            let step = alphaMaxCount;

            // 根据排序结果获取optionList索引
            copyOptionList.forEach((c1,idx, arr) => {
                optionList.forEach(c2 => {
                    if(c1.id == c2.id && c2.voted){
                        // optionlist动态添加sort属性
                        c2.sort = Math.max(step--, 0);
                        return false;
                    }
                })
            });

            //计算num和bar
            optionList.forEach(option => {
                // 当前item投票人数比例
                let num = util.round((option.voteCount || 0) / voteCount,2);
                // bar比例
                let bar = num * BAR_WIDTH.toFixed(3)*100;
                
                if(!option.voted){
                    // 默认未选中：蓝色
                    option["background"] = COLOR.blue;  
                }else{
                    const alpha = alphaBase + alphaStep * option.sort;
                     //设置多选的透明度
                    option["background"] = "rgba(254, 142, 149,"+alpha/10+")";
                }
                
                option["num"] = `${Math.floor(num * 100)}%`;
                option["bar"] = `${bar}%`;
            })
        }

        return {
            optionList,
            voteCount,
            voted
        }
    }

    //单选点击事件
    handleRadioClick = (e) =>{
        dataStat("threaddetail_vote_logged_in");

        if(this.state.voted){return;}
        let index = $(e.currentTarget).attr('data-index');
        let id = this.props.InitData.optionList[index].id;
      
        let voteObj = {
            voteId:this.props.InitData.id,
            optionIdList:id
        };

        this.sendVoteToService(voteObj);
    }

    //发送投票结果到服务器
    sendVoteToService = (voteObj) => {
    	request({
            url: '/item/do_vote_option',
            method: 'post',
            data: voteObj
        }).then((ret) => {
                
            const data = ret.data;

            // 数据转换
            const transformedData = this.transformData(data);

            //更新状态              
            this.setState({
            	...transformedData
	        })
                          
        })
    }

    //渲染单选/多选的投票区域
	_renderVoteList = () => {
		let {type} = this.props.InitData;
        console.log(this.state.optionList);
        let votedStyle = classNames("vote-wrap",{'voted':this.state.voted});
	    return (
	       <div className={votedStyle}>
		       <ul>
			    {
			    	this.state.optionList.map((option,index) =>{
			    		if(type ==1){
			    			return (<Radio  key={index} index={index} option={option} onClick={this.handleRadioClick}/>)
			    		}else{
			    			return (<CheckBox  key={index}  index={index} option={option} onClick={this.handleCheckBoxClick}/>)
			    		}
			    	})
		        }
		       </ul>
	       </div>
	    );
	}

	//渲染多选框的投票按钮
	_renderMutiVoteButton = () => {
		//控制是否显示多选投票的Btn
   		let shouldShow = !this.state.voted && this.props.InitData.type != 1 ? true :false;
	    return (
	    	<div>
	    	{(shouldShow)
		        ? <div className="vote-muti"><div className="vote-btn" onClick={this.handleVoteClick}><div>投票</div></div></div>
		        : null
		    }
	    	</div>  
	    );
	}

    render() {

	  	let {
	  		type,
	  		title
	  	} = this.props.InitData;

   		let voteType = classNames({'voteTitle-1':type == 1,'voteTitle-2':type == 2});

	    return (
	    	<div>
	    		<div className="vote-header media">
                    <span className="voteTypeLabel wux-1px-radius fl">{ type == 1 ? '单选投票':'多选投票' }</span>
		            <div className={`vote-title media-body ${voteType}`}> {title} </div>
		        </div>
		        {this._renderVoteList()}
		        <div className="vote-footer">
		        	投票后查看结果 | 共{this.state.voteCount}人投票
		        </div>
		        {this._renderMutiVoteButton()}
	    	</div>
	    )
  	}
}
