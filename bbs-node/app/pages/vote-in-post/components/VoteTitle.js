import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {TextareaAutosize} from '@wac/react-ui';

// 最大字符限制
const MAX_LIMIT = 25;

export default class VoteTitle extends Component {
  
  static propTypes = {
    updateVoteTitle: PropTypes.func,
    value:PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
        textlength: MAX_LIMIT,
        showRed: false,
        value: this.props.value 
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.value !== nextProps.value){
      const canInput = MAX_LIMIT - nextProps.value.length;
      this.setState({
        value: nextProps.value,
        textlength: canInput
      })
    }
  }

  handleChange = e => {
    const canInput = MAX_LIMIT - this.state.value.length;
    this.props.updateVoteTitle(e.target.value);
    this.setState({ 
        value: e.target.value,
        textlength: canInput,
        showRed: !!(canInput < 0)
    });
  }

  render() {
    let textColor = classNames("right",{"addred":this.state.showRed});

    return (
        <div className="header-title wux-1px-b">
          <div className="header-flex">
              <div className="left" >
                <TextareaAutosize id="voteTitle" value={this.state.value} maxRows={2} placeholder="投票主题"
                onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
              </div>
              <div className={textColor}>
                  <span>{this.state.textlength}字</span>
              </div>
          </div>
        </div>
    )
  }
}
