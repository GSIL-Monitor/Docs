import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OptionTextInput from './OptionTextInput'
import dataStat from '../../../components/stat';


export default class OptionItem extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    editOption: PropTypes.func.isRequired,
  };

  constructor(props){
    super(props);
    this.state = {
      option: this.props.option
    }
  }

  handleSave = (id, text) => {
    this.props.editOption(id, text);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.option !== nextProps.option && nextProps.option){
      this.setState({
        option: nextProps.option
      })
    }
  }
  
  render() {
    const { option } = this.state

    let element = (
        <div className="optionItem">
            <div className="left">
              <div className="destroy" onClick={() => {dataStat("post_vote_deleteoption");this.props.deleteOption(option.id);}}>
                        <div></div>
              </div>
            </div>
            
            <div className="right wux-1px-b">
               <OptionTextInput maxLength={32} placeholder="选项" text={option.text}
                               onSave={(text) => this.handleSave(option.id, text)} />
            </div>
        </div>

    )

    return (
      <li>
        {element}
      </li>
    )
  }
}
