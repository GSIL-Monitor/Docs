import React from 'react';
import Flipper from '../Flipper';
import schema from './schema.js';
import './style.less';

class Countdown extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      diff: this.getDiffObject(this.props.start)
    }
  }

  componentDidMount() {
    this.props.onInit && this.props.onInit();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if(this.props.start !== nextProps.start && nextProps.start ){
      this.setState({
        diff: this.getDiffObject(nextProps.start)
      })
    }
  }

  getDiffObject(dateCount) {
    var days = Math.abs(dateCount),
        ten = Math.floor(days / 10),
        hundred = Math.floor(ten / 10),
        thousand = Math.floor(hundred / 10);

    return {
      thousand: thousand % 10,
      hundred: hundred % 10,
      ten: ten % 10,
      days: days % 10
    };
  }

  render() {
    return (
      <div className='countdown'>
        {Object.keys(this.state.diff).map(key => <div
            key={key}
            className={`countdownItem countdown-${key}`}>
              {Array(1).fill(0).map((_, i) => <Flipper
                key={`${key}${i}`}
                now={this.state.diff[key]}
                min={0}
                max={9}
              />)}
          </div>
        )}
      </div>
    )
  }
};

Countdown.propTypes = schema.types

Countdown.defaultProps = schema.defaults

export default Countdown;
