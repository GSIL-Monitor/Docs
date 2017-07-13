import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainSection from '../components/MainSection';
import Header from '../components/Header';
import * as OptionActions from '../actions';


const App = ({options, optionList, actions}) => (
  <div className="voteContainer">
    <Header actions={actions} {...options} />
    <MainSection voteInfo={options} options={optionList} actions={actions}/>
  </div>
)

App.propTypes = {
  options: PropTypes.object,
  optionList: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  options: state.options,
  optionList: state.options.options
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(OptionActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
