import { 
  ADD_OPTION,
  DELETE_OPTION,
  EDIT_OPTION,
  UPDATE_OPTIONS,
  UPDATE_VOTE_TYPE,
  UPDATE_VOTE_TITLE,
  BBS_RESET_VOTE
} from '../constants/ActionTypes'

let initialState = {
  options: [{
    id: 0,
    text: ''
  },
  {
    id: 1,
    text: ''
  }],

  title: '',
  voteType: 1,
}

export default function options(state=initialState , action) {
  switch (action.type) {
    case ADD_OPTION:
      return Object.assign({}, state, {
        options: state.options.concat([{
          id: action.id,
          text: action.text
        }])
      })

    case DELETE_OPTION:
      return Object.assign({}, state, {
        options: state.options.filter(option =>
            option.id !== action.id
          )
      })

    case EDIT_OPTION:
      return Object.assign({}, state, {
        options: state.options.map(option =>
            option.id === action.id ?
              { ...option, text: action.text } :
              option
          )
      })

    case UPDATE_OPTIONS:
        return Object.assign({}, state, {
          options: action.options,
        })

    case UPDATE_VOTE_TYPE:
        return Object.assign({}, state, {
          voteType: action.voteType
        })

    case UPDATE_VOTE_TITLE:
        return Object.assign({}, state, {
          title: action.title
        })

    case BBS_RESET_VOTE:
        return initialState

    default:
      return state
  }
}
