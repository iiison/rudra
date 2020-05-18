import { makeReducer } from '../../utils/reduxUtils'

const wrapper = makeReducer({
  shouldMergeDefaultStates : true,
  actionName               : 'NOTIFICATION_CONTENT',
  additionalActions(state, action) {
    return {
      SET_NOTIFICATIONS_CONTENT : () => ({
        ...state,
        content: action.content
      })
    }
  },
  initialState : {
    content: {
      title   : '',
      options : []
    }
  }
}) 
const SET_NOTIFICATIONS_CONTENT = 'SET_NOTIFICATIONS_CONTENT'

export function setNotificationContent (content = {}) {
  return {
    type : SET_NOTIFICATIONS_CONTENT,
    content
  }
}

export default wrapper
