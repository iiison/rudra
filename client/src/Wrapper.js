import React, { useEffect, useState } from 'react';
import { useLocation, useHistory }    from 'react-router-dom'
import annyang                        from 'annyang'

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
    },

    'make new directory atx *path' : (path) => {
      console.log('*****************************')
      console.log(path)
      console.log('*****************************')
    }
  }

  annyang.removeCommands(Object.keys(commands))
  annyang.addCommands(commands)
}

function Wrapper({ children }) {
  const location = useLocation()
  const history = useHistory()
  const [showContext, toggleContext] = useState(true)
  const [contextContent, setContext] = useState({
    heading: 'What is your problem?',
    listItems : ['itme 1', 'itme 2', 'itme 3', 'itme 4']
  })

  useEffect(() => SetupAnnyang({ history, location }), [location])

  return (
    <div>
      {children}
      {
        showContext && (
          <div className='context-menu'>
            <h2 className='context-title'>{contextContent.heading}</h2>
            <ul className='context-options'>
              {contextContent.listItems.map(item => <li key={item}>{item}</li>)}
              <li><input type='text' className='context-input' placeholder='Item 1' /></li>
            </ul>
          </div>
        )
      }
    </div>
  )
}

export default Wrapper;

