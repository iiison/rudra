import React, { useEffect }        from 'react';
import { useSelector }             from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom'
import annyang                     from 'annyang'

import { resetContext } from './redux/modules/wrapper/wrapper'
import Input            from './screens/components/input/input'

function SetupAnnyang({ history, location }) {
  const commands = {
    'go home' : () => {
      debugger
      if (location.pathname !== '/'){
        history.go('/');
      }
    },

    'show context' : () => {
      if (location.pathname !== '/'){
        history.go('/');
      }
    }
  }

  annyang.removeCommands(Object.keys(commands))
  annyang.addCommands(commands)
}

function handleOptionClick({ customEvent, ...restOptions }) {
  resetContext()
  return customEvent && customEvent(restOptions)
}

function handleInputChange({ value, customEvent, ...restOptions }) {
  return customEvent && customEvent({
    ...restOptions,
    active : value
  })
}

function Wrapper({ children }) {
  const location = useLocation()
  const history = useHistory()
  // const [showContext, toggleContext] = useState(true)
  // const [contextContent, setContext] = useState({
  //   heading: 'What is your problem?',
  //   listItems : ['itme 1', 'itme 2', 'itme 3', 'itme 4']
  // })

  useEffect(() => SetupAnnyang({ history, location }), [location])

  const { content, showContext } = useSelector(state => state.wrapper)
  const {
    event   : customEvent,
    title   : notficationHeader,
    options : notficationOptions
  } = content

  return (
    <div>
      {children}
      {
        showContext && (
          <div className='context-menu'>
            <h2 className='context-title'>{notficationHeader}</h2>
            <ul className='context-options'>
              {notficationOptions.map(item => (
                <li
                  key={item}
                  onClick={() => handleOptionClick({
                    customEvent,
                    active  : item,
                    options : notficationOptions
                  })}
                >
                  {item}
                </li>
              ))}
              {notficationOptions.length === 0 && (
                <li>Enter name in the input below:</li>
              )}
              <li>
                <Input
                  returnData={{
                    customEvent,
                    active  : '',
                    options : notficationOptions,
                  }}
                  event={handleInputChange}
                  placeholder='Enter custom value?'
                  className='context-input'
                />
              </li>
            </ul>
          </div>
        )
      }
    </div>
  )
}

export default Wrapper;

