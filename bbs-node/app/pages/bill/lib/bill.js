import React, { Component } from 'react'
import request from 'request'
import { throttle } from 'lodash'

import { 
  Toast,
  Group,
  Cell
} from '@wac/react-ui'
import Divider from '../../../components/react/divider/'

class Bill extends Component {

    constructor (props) {
        super(props)
        this.state = {
            totalCopper: null, // 总铜钱数
            billList: [], // 账单列表
            loading: true, // 是否在加载
            loadAll: false // 是否已数据加载完
        }
    }

    componentDidMount () {
        this._getBillList()
        this._registerScrollEvent()
    }

    render () {
        const { totalCopper, billList, loading, loadAll } = this.state
        return (
            <main>
              { this._renderToast(loading) }
              { this._renderHeader(totalCopper) }
              { this._renderCell(billList) }
              { this._renderFooter(loadAll) }
            </main>
        )
    }

    // 注册上拉加载事件
    _registerScrollEvent () {
        $(document).on('scroll', throttle(e => {
            if ($(window).scrollTop() + $(window).height() === $(document).height()) {
                const { billList } = this.state
                const lastId = billList[billList.length - 1].id
                this._getBillList(lastId)
            }
        }, 200))
    }

    // 获取数据
    _getBillList (lastId = null) {
        const PAGE_SIZE = 20
        this.setState({
            loading: true
        })
        request({
          method: 'get',
          url: '/copper/bill',
          data: {
            lastId,
            size: PAGE_SIZE
          }
        })
        .then(res => {
            const { totalCopper, billList } = res.data
            // 当返回的条数少于pagesize时 说明取完了
            if (this.state.billList.length && billList.length < PAGE_SIZE) {
                this.setState({
                  loadAll: true
                })
            }
            // 添加到末尾
            const newBillList = this.state.billList.concat(billList)
            this.setState({
                totalCopper,
                billList: newBillList,
                loading: false
            })
        })
    }

    _renderToast (loading) {
        return (
          <Toast
            show={ loading }
            type={ 'loading' } >
            <span>加载中...</span>
          </Toast>
        )
    }

    _renderHeader (copper) {
        return (
          <header 
            className="header">
            { `铜钱总数: ${copper}` }
          </header>
        )
    }

    _renderCell (list) {
        return list.length
        ? (
          <Group className="group">
            {
              list.map(({ detail, opTime, copper }, index) => {
                const copperClassName = copper.startsWith('-') ? 'pay' : 'income'
                return (
                  <Cell
                    className="cell"
                    key={ index }
                    title={ detail }
                    inlineDesc={ opTime }
                    value={ `<span class=${copperClassName} >${copper}</span>` } />
                )
              })
            }
          </Group>
        )
        : <Divider title="还没有账单哦" />
    }

    _renderFooter (loadAll) {
      return loadAll
      ? <Divider title="已经到底啦" />
      : null
    }

}

export default Bill
