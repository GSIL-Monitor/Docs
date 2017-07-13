import React, { Component } from 'react'
import PropTypes from 'prop-types';
import dataStat from '../../../components/stat';
import Confirm from 'react/confirm';
import Toast from '@wac/toast';
import {connect} from '@wac/bridge-utils';

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
    background: '#fff',
    borderRadius:'12px',
    transform : 'translate(-50%, -50%)',
    webkitTransform: 'translate(-50%, -50%)'
  },
  overlay: {
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.6)'
  }
};

export default class Footer extends Component {
  static propTypes = {
    addOption: PropTypes.func.isRequired,
    voteInfo: PropTypes.object,
    validOptionList: PropTypes.array,
    optionLength: PropTypes.number.isRequired
  }
  
  constructor(props){
        super(props);
        this.state = {
          confirmVisible: false
        }
        this.handleClearVote = this.handleClearVote.bind(this);
        this._onCancelVote = this._onCancelVote.bind(this);
        this._onConfirmVote = this._onConfirmVote.bind(this);
        this._onConfirmHide = this._onConfirmHide.bind(this);
        this._onConfirmShow = this._onConfirmShow.bind(this);
        this.toggleVisible = this.toggleVisible.bind(this);
  }

  handleSave = () =>  {
    //添加选项按钮埋点
    dataStat("post_vote_addoption");
    this.props.addOption();
  }

  // 清除投票
  handleClearVote(){
    if(!this.props.validOptionList.length && !this.props.voteInfo.title){
      Toast('还没填写投票内容呢');
      return false;
    }
    
    this.setState({
      confirmVisible: true
    })
  }

  toggleVisible(isVisible){
    this.setState({
      confirmVisible: isVisible
    })
  }

  // 取消消除投票
  _onCancelVote(){
    this.toggleVisible(false);
  }

  // 确认消除投票
  _onConfirmVote(){
    this.clearClientVoteInfo();
    this.toggleVisible(false);
    this.props.resetVote();
  }

  //通知客户端清除之前保存的投票信息
  clearClientVoteInfo = () => {
    let voteObj={};
    voteObj.voteType = 1;
    voteObj.voteTitle = '';
    voteObj.voteOptionList = [];
    connect(bridge => {
        bridge.isSupport('bbsVoteInPost')
            .then(isSupport => {
                dataStat("clearVote");
                bridge.bbsVoteInPost(voteObj);
            })
            .catch(err => {
                console.log(err);
            });
    });
  }

  // 隐藏confirm
  _onConfirmHide(){

  }

  _onConfirmShow(){

  }
  
  render() {
    const { optionLength } = this.props

    let btnClass="addOptionBtn";
        btnClass += optionLength === 12 ? ' disabledBtn' : ' enabledBtn';

    let textWord = optionLength === 12 ? '最多12个选项哦' : '添加选项';

    let btnDisabled = optionLength === 12 ? true : false;

     let content = `<div class="clearVoteText">确认是否清除投票？</div>`;

    return (
       
        <footer className="footer">
          <div className={btnClass}  disabled={btnDisabled} onClick={this.handleSave}>{textWord}</div>
          <div className="clearVote" onClick={this.handleClearVote}>清除投票</div>

          <Confirm
              show={this.state.confirmVisible} 
              content={content}
              style={customStyles}
              onCancel={this._onCancelVote}
              onConfirm={this._onConfirmVote}
              onHide={this._onConfirmHide}
              onShow={this._onConfirmShow}
          />

        </footer>

    )
  }
}
