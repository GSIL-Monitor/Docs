/**
 * @overview
 * @author zanghong
 * @date 6/7/17
 */

import React,{Component} from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Modal from 'react-modal';
import './index.less'

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
    borderRadius:'none',
    transform : 'translate(-50%, -50%)'
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)'
  }
};

export default class Alert extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      show: this.props.show
    }

    this.closeModal = this.closeModal.bind(this);
    this.onShow = this.onShow.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  static propTypes = {
    content: PropTypes.node,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    title: PropTypes.string,
    closeByOverlay: PropTypes.bool,
    className: PropTypes.string,
    onShow: PropTypes.func,
    onHide: PropTypes.func
  };

  static defaultProps = {
    cancelText: '取消',
    confirmText: '确认',
    title: '',
    closeByOverlay: false,
    style: customStyles
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.show !== nextProps.show){
      this.setState({
        show: nextProps.show
      })
    }
  }

  handleClick = () => {
    this.props.handleRequestClose()
  }

  closeModal(){
    this.props.onHide && this.props.onHide();
  }

  onShow(){
    this.props.onShow && this.props.onShow();
  }

  onCancel(){
    this.props.onCancel && this.props.onCancel();
  }

  onConfirm(){
    this.props.onConfirm && this.props.onConfirm();
  }

  render () {
    const { content,title,cancelText,confirmText,className,style } = this.props;

    const cls = classNames({
      'wux_confirm': true,
      'weui_dialog_alert':true,
      'weui_dialog_confirm':true,
      [className]: className
    })

    return (
      <Modal
          isOpen={this.state.show}
          onAfterOpen={this.onShow}
          onRequestClose={this.closeModal}
          style={style}
          contentLabel={'wux-confirm'}
          shouldCloseOnOverlayClick={false}
      >
        <div className={cls}>
          <div className="weui_dialog_hd">
            <strong className="weui_dialog_title">{title}</strong>
          </div>
          <div className="weui_dialog_bd" dangerouslySetInnerHTML={{__html: content}}></div>
          <div className="weui_dialog_ft">
            <a href="javascript:;" className="weui_btn_dialog default" onClick={this.onCancel}>{cancelText}</a>
            <a href="javascript:;" className="weui_btn_dialog primary" onClick={this.onConfirm}>{confirmText}</a>
          </div>
        </div>
      </Modal>
    )
  }
}
