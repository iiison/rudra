import { useCallback } from 'react'
import { useDispatch, useMappedState } from 'redux-react-hook'

function useDispatchableAction ( action, dependencies ) {
  const dispatch = useDispatch()
  const actionCreator = useCallback(function(){
    return dispatch(action.apply(null, arguments))
  }, [action, dispatch, dependencies])

  return actionCreator
}

export function useDispatchableActions (actions) {
  return actions.reduce((prev, { action, dependencies = [], name }) => ({
    ...prev,
    [name] : useDispatchableAction(action, dependencies) // eslint-disable-line
  }), {})
  // return actions.map(({ action, dependencies = [] }) => useDispatchableAction(action, dependencies))
}

function useStore (fieldName) {
  const mapState = useCallback((state) => ({ [fieldName] : state[fieldName] }), [fieldName])
  const value = useMappedState(mapState)

  return value
}

export function useStoreValues (stateFields) {
  return stateFields.reduce((prev, fieldName) => {
    return {
      ...prev,
      [fieldName] : useStore(fieldName)[fieldName] // eslint-disable-line
    } 
  }, {})
}

