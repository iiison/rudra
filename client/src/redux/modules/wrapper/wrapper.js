import { makeReducer } from '../../utils/reduxUtils'
import store from '../../../configs/store'

const wrapper = makeReducer({
  shouldMergeDefaultStates : true,
  actionName               : 'NOTIFICATION_CONTENT',
  additionalActions(state, action) {
    return {
      SET_NOTIFICATIONS_CONTENT : () => ({
        ...state,
        content: action.content
      }),
      TOGGLE_CONTEXT : () => ({
        ...state,
        showContext : action.state || !state.showContext
      })
    }
  },
  initialState : {
    showContext : false,
    content: {
      title   : '',
      options : []
    }
  }
})

const SET_NOTIFICATIONS_CONTENT = 'SET_NOTIFICATIONS_CONTENT'
const TOGGLE_CONTEXT = 'TOGGLE_CONTEXT'

export function setNotificationContent (content = {}) {
  return {
    type : SET_NOTIFICATIONS_CONTENT,
    content
  }
}

export function toggleContext(newState) {
  return {
    type  : TOGGLE_CONTEXT,
    state : newState
  }
}

export function resetContext() {
  store.dispatch(setNotificationContent())
  store.dispatch(toggleContext(false))
}

export default wrapper
