import React from 'react'
import { Route, Switch } from 'react-router-dom'

// import Test from '$COMPONENTS/test'
// import Test2 from '$COMPONENTS/Test2'

import Home from '../screens/home/Home'

// import {
//   Home,
//   RepoDetails
// } from '$CONTAINERS'

const routes = () => (
  <div className='app grid'>
    <div className='col'>
      <Switch>
        <Route exact={true} path='/' component={Home} />
        <Route path='/explore/:query' component={Home} />
      </Switch>
    </div>
  </div>
)

export default routes
