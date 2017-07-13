import React, { Component } from 'react';
import {connect} from '@wac/bridge-utils';
import PropTypes from 'prop-types';
import {ActionSheet} from '@wac/react-ui';
import VoteTitle from './VoteTitle'
import Toast from '@wac/toast';
import dataStat from '../../../components/stat';

// 右上角只能挂载window作用域才生效
window.addvotecomplete = function() {

    if($("#voteTitle").val() ==''){
      Toast("请输入投票主题");
      dataStat("post_vote_theme_1");
      return;
    }else if($("#voteTitle").val().length >25){
      Toast("投票主题不能超过25字");
      dataStat("post_vote_theme_2");
      return;
    }


    let count =0;
    let voteObj ={};
    let voteType = $("#showVaule").html() == "单选" ? 1: 2;
    voteObj.voteTitle = $("#voteTitle").val();
    voteObj.voteType = voteType;
    voteObj.voteOptionList = [];

    window._MainSection_.props.options.forEach((option) =>{

        if(option.hasOwnProperty('text') && option.text.length != 0){
           count++;
           voteObj.voteOptionList.push(option.text);
        }
    })

    if(count < 2){
      Toast("请输入至少2个投票选项");
      dataStat("post_vote_option");
      return;
    }

    connect(bridge => {
        bridge.isSupport('bbsVoteInPost')
            .then(isSupport => {
                dataStat("post_vote_save");
                bridge.bbsVoteInPost(voteObj);
            }).then(()=> {
              setTimeout(() => {
                  window.location = 'wacai://close';
              }, 40)
            })
            .catch(err => {
                console.log(err);
            });
    });
}

export default class Header extends Component {
  
  static propTypes = {
    actions: PropTypes.object.isRequired,
    title: PropTypes.string
  };

  static defaultProps = {
    title: ''
  };

  constructor(props) {
        super(props);        
        this.state = {
            isShow:false
        }
        this.initBridge();
  }

  componentWillMount(){
    $('#vote-container').removeClass('preload');
  }
  
  initBridge =() => {
      connect(bridge => {
              //Native 与WebView 通信
              bridge.init && bridge.init((message, sendResponse) => {
                      const data = JSON.parse(message);
                     
                      if (data.action === 'bbsVoteInPost') {
                          let voteType=data.params.voteType;
                          console.log("voteType:   "+voteType);
                          let voteTitle=data.params.voteTitle ||'';
                          console.log("voteTitle:   "+voteTitle);
                          let options;
                          if(data.params.voteOptionList.length!=0){
                            options = data.params.voteOptionList;
                          }else{options =['','']}
                          console.log("options:   "+options);
                          // 更新投票sheet
                          this.props.actions.updateVoteType(voteType);
                          this.props.actions.updateVoteTitle(voteTitle);
                          this.props.actions.updateOptions(options);
                      }
              });

              bridge.isSupport('setNavButton')
              .then((isSupport) => {
                  bridge.setNavButton([{
                      text: '完成',
                      message: 'window.addvotecomplete()'
                  }])
              })
              .catch(err => {
                  console.error(err);
              });
      });
  }


  handleSelectChange = () => {
    dataStat("post_vote_typeselect");
    const { isShow } = this.state;
    this.setState({isShow: !isShow})
  }

  handleRequestClose = () => {
    dataStat("vote_dialog_cancel");
    this.handleSelectChange();
  }
  
  handleRequestSelect = e => {
      let voteType = e.target.innerText == '单选' ? 1 : 2;
     
      if(voteType == 1){
        dataStat("vote_dialog_radio");
      }else{
        dataStat("vote_dialog_checkbox");
      }
      this.props.actions.updateVoteType(voteType)
      this.handleSelectChange();
  }

  
  render() {
    const menus = [{content: '单选'}, {content: '多选'}];
    let voteType = this.props.voteType == 1 ? '单选': '多选';

    return (
        <header className="header">
            <div className="header-select wux-1px-b" onClick={this.handleSelectChange}>
                 <span id="showVaule">{voteType}</span>
                 <span className="cross"></span>
            </div>

            <VoteTitle value={this.props.title} {...this.props.actions} />

            <ActionSheet
                isShow = {this.state.isShow} 
                showVaule = {voteType}
                menus = {menus} 
                handleRequestSelect = {this.handleRequestSelect}
                handleRequestClose = {this.handleRequestClose}
            />
        </header>
    )
  }
}


