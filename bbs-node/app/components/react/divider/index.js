import React from 'react'
import PropTypes from 'prop-types'

const Divider = ({ title }) => (
  <div
    className="wux-divider">
    <span>{ title }</span>
  </div>
)

Divider.propTypes = {
  title: PropTypes.string.isRequired
}

export default Divider
