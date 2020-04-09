import { makeReducer } from '../../utils/reduxUtils'

const home = makeReducer({
  actionName : 'file',
  shouldMergeDefaultStates : true,
  initialState : {
    query : ''
  },
  additionalActions(state, action) {
    return {
      SET_QUERY_RESULTS : () => ({
        ...state,
        files : action.files
      })
    }
  }
})

const SET_QUERY_RESULTS = 'SET_QUERY_RESULTS'

export function setQueryResults (files = '') {
  return {
    type : SET_QUERY_RESULTS,
    files
  }
}

export default home

