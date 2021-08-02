import React from 'react';
import ReactDOM from 'react-dom';
import Table from './table';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';


ReactDOM.render(
  <Router>
        <Route path="/table/:tableid" component={Table} />
  </Router>,
  document.getElementById('root')
);
