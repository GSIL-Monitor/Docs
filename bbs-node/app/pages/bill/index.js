import React from 'react'
import ReactDOM from 'react-dom'

import BillView from './lib/bill'
import './index.less'

const MOUNT_NODE = document.getElementById('app')
ReactDOM.render(<BillView />, MOUNT_NODE)
