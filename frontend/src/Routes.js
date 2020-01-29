import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import TableData from './pages/TableData'
import TableDataAggregate from './pages/TableDataAggregate'

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={TableData} />
        <Route path="/aggregate" component={TableDataAggregate} />
      </Switch>
    </BrowserRouter>
  )
}
