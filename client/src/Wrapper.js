import React, { useEffect } from 'react';
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

    'search for files *file' : (file) => {
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

  useEffect(() => SetupAnnyang({ history, location }), [location])

  return (
    <div>
      {children}
    </div>
  )
}

export default Wrapper;

