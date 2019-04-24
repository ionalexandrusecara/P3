// App.js

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import {Switch, BrowserRouter, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Navbar />
          <Route exact path="/" component={Home}/>
          <Route path="/dashboard" component={Dashboard}/>
        </BrowserRouter>
         
      </div>
    );
  }
}

export default App;