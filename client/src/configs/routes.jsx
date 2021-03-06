import React from 'react'
import { Route, Switch } from 'react-router-dom'

// import Test from '$COMPONENTS/test'
// import Test2 from '$COMPONENTS/Test2'

import Home from '../screens/home/Home'
import Editor from '../screens/Editor/Editor'
import Wrapper from '../Wrapper'

// import {
//   Home,
//   RepoDetails
// } from '$CONTAINERS'

const routes = (annyangRef) => (
  <div className='app grid'>
    <div className='col'>
      {annyangRef ? (
        <Wrapper>
          <Switch>
            <Route exact={true} path='/' component={Home} />
            <Route path='/explore/:query/:index' component={Editor} />
          </Switch>
        </Wrapper>
      )
      : (<div>Speech Synthesis is not supported!</div>)}
    </div>
  </div>
)

export default routes
