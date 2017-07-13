import React, {Component } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class CheckBox extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired
  }

  constructor(props) {
        super(props);
  }

  handleClick = (e) =>{
     this.props.onClick(e);
   
  }


  render() {
  
    let {
      bar,
      background,
      num,
      content,
      checked
    }=this.props.option;


    let barStyle = {"width":bar,"background":background};
    let checkedStyle = classNames({'checkbox-checked':checked});
    const cls = classNames({
        'active': this.props.option.checked
    });

    return (

        <li className={cls} data-index={this.props.index} onClick={this.handleClick}>
            <div className="bar" style={barStyle}></div>
            <div className="content">{content}</div>
            {checked
                ? <div className="checkbox">
                    <div className={checkedStyle}></div>
                  </div>
                : null
            }
            <div className="num">{num}</div>
        </li>

    )
  }
}
