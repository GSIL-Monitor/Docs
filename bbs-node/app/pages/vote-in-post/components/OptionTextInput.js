import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {TextareaAutosize} from '@wac/react-ui';
import Toast from '@wac/toast';



export default class OptionTextInput extends Component {

  static propTypes = {
    maxLength: PropTypes.number.isRequired,
    placeholder: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired
  }

  constructor(props) {
        super(props);
        this.state={
            text: this.props.text 
        }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.text !== nextProps.text){
      this.setState({
        text: nextProps.text
      })
    }
  }

  handleSubmit = e => {
    const text = e.target.value.trim()
    if(text.length >= 32){ Toast('选项最多输入32字');return;}
    this.props.onSave(text);
    
  }

  handleChange = e => {
    this.setState({ text: e.target.value });
    this.props.onSave(e.target.value);
  }

  handleBlur = e => {
      this.props.onSave(e.target.value);
  }

 

  render() {
    return (
     
          <TextareaAutosize 
            maxLength={this.props.maxLength}
            placeholder={this.props.placeholder}
            value={this.state.text}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onKeyUp={this.handleSubmit}
          />

      
    )
  }
}
