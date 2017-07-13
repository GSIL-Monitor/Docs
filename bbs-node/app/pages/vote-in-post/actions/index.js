import * as types from '../constants/ActionTypes'

// 随机值，保证唯一性
let uid = 2;
export const addOption = () => ({ type: types.ADD_OPTION, text:'', id: uid++})
export const deleteOption = id => ({ type: types.DELETE_OPTION, id })
export const editOption = (id, text) => ({ type: types.EDIT_OPTION, id, text })

// 更新投票信息
export const updateOptions = (optionList = []) => {
	return {
		type: types.UPDATE_OPTIONS,
		options: optionList.map(item => {
			return {
				id: uid++,
				text: item
			}
		})
	}
}
// 更新投票类型
export const updateVoteType = (voteType) => {
	return {
		type: types.UPDATE_VOTE_TYPE,
		voteType
	}
}

// 更新投票主题
export const updateVoteTitle = (title) => {
	return {
		type: types.UPDATE_VOTE_TITLE,
		title
	}
}


// 清除投票选项
export const resetVote = () => {
	return {
		type: types.BBS_RESET_VOTE
	}
}
