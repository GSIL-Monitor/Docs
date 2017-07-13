import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import request from 'request';

import { Toast, Group, Cell} from '@wac/react-ui';

const Icon = (src) => (
  <div className="imgWrap wux-1px-radius">
  	<img src={src} className="responsive" />
  </div>
);

const Ranking = (index) => {
	const rankingIndex = (index < 10 ? '0' : '') + index;
	const cls = classNames({
        [`rank_${index}`]: index == 1 || index == 2 || index == 3,
        'rank_index': true,
    });
	return <span className={cls}>{rankingIndex}</span>
}

class Rank extends Component {

	constructor(props){
		super(props);

		this.state = {
			list: [],
			loading: true
		}

		this.onCellClick = this.onCellClick.bind(this);
	}

	componentDidMount() {
		this.initRanking();
	}

	onCellClick(rank){
		return () => {
			window.location = `/app/home?uid=${rank.uid}&popup=1&need_zinfo=1`;
		}
	}

	initRanking(){
		request({
            url: '/member/sign_ranking'
        }).then((ret) => {
            const data = ret.data;

            data.forEach((item, index) => {
                index++;
                item.rankingIndex = index;
            });

            this.setState({
            	list: data,
            	loading: false
            })
            
        }).catch((err) => {
            console.error(err);
        });
	}

	render(){
		return (
			<div className="rankingPage">
				<Toast show={this.state.loading} type={'loading'}>
					<span>加载中...</span>
				</Toast>
				<Group>
					{ this.state.list.map((el,index) => {
						let IconComp = (
							<div className="headImg flex wux-center">
								{ Ranking(index+1) }
								{ Icon(el.headImgUrl) }
							</div>
						)
						return (
							<div className="cellContainer" key={el.uid}>
								<Cell 
									className={'rankCell flex-between wux-center-v'}
									icon={ IconComp } 
									title={el.nickName} 
									value={`连续签到${el.continueSignDay}天`}
									onCellClick={this.onCellClick(el)}
								/>
								<div className="line"></div>
							</div>
						)
					})}
	    		</Group>
		    </div>
		)
	}
}

export default Rank;