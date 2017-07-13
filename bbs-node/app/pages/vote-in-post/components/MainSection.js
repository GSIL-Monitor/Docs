import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OptionItem from './OptionItem';
import Footer from './Footer';

export default class MainSection extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    voteInfo: PropTypes.object,
    actions: PropTypes.object.isRequired
  }

  constructor(props) {
        super(props);
        this.state = {
          options:this.props.options,
        }
  }

  componentDidMount(){
    window._MainSection_ = this;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.options !== nextProps.options && nextProps.options){
      this.setState({
        options: nextProps.options
      })
    }
  }

  renderFooter() {
    const { options = [],voteInfo={}, actions} = this.props;
    // 有内容的option列表
    const validOptionList = options.filter(option => !!option.text).map(option => option.text);

      return (
        <Footer 
            optionLength={options.length}
            validOptionList={validOptionList}
            voteInfo={voteInfo}
            {...actions}
        />
      )
  }
  
  render() {
    const { actions } = this.props;
    const { options } = this.state;

    return (
      <section className="main">
        <ul className="option-list">
          {options.map(option =>
            <OptionItem key={option.id} option={option} {...actions} />
          )}
        </ul>
        {this.renderFooter()}
      </section>
    )
  }
}
