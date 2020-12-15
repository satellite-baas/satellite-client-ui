import React, { useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import Authentication from './auth/Authentication';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './layout/Dashboard';

import './css/App.css';
import 'bulma/css/bulma.css';

// state for schema, and api keys

const satellites = [{
  id: 1,
  name: 'Todo App',
  domain: 'todoapp',
  endpoint: 'todoapp.localhost.com',
  apiKey: uuidv4(),
  files: true
}, {
  id: 2,
  name: 'Shopping Cart',
  domain: 'shoppingcart',
  endpoint: 'shoppingcart.localhost.com',
  apiKey: uuidv4(),
  files: false
}];

// schema is fetched on route load of schema
// keys are fetched on route load of api

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSatellite: null,
      satellites: [],
      isLoggedIn: false,
      loading: false,
      done: null,
      loadingDestroy: false,
      doneDestroy: null,
      origin: 'http://admin.ilyaskussainov.com',
      login: true
    };
  }

  componentDidMount() {
    axios.get(
      `${this.state.origin}/backends`, {
        withCredentials: true
      }
    )
    .then(res => { 
      console.log(res)
      res.json()
    })
    .then(json => {
      console.log(json)
    })
    .catch(err => {
      console.log(err)
    });

    // for now we'll use static state
    // fetch(`${this.state.origin}/backends`,{
    //   credentials: 'include'
    // })
    // .then(res => {
    //   console.log(res);
    //   return res.json();
    // })
    // .then(json => {
    //   if (json.status >= 401) {
    //     return;
    //   }

    //   console.log(json)
    //   // object with key backends, array value
    //   this.setState({
    //     satellites:  json.backends,
    //     currentSatellite: json.backends[0] || null
    //   });
    // })
    // .catch(err => {
    //   // do something
    // });
    // this.setState({
    //   satellites: [],
    //   currentSatellite: null
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('yes')
    if (prevState.isLoggedIn != this.state.isLoggedIn) {
      console.log('in')
      axios.get(
        `${this.state.origin}/backends`, {
          withCredentials: true
        }
      )
      .then(res => { 
        console.log(res)
        res.json()
      })
      .then(json => {
        console.log(json)
      })
      .catch(err => {
        console.log(err)
      });
      // fetch(`${this.state.origin}/backends`, {
      //   credentials: "include"
      // })
      // .then(res => {
      //   console.log(res);
      //   return res.json();
      // })
      // .then(json => {
      //   if (json.status >= 401) {
      //     return;
      //   }

      //   console.log(json)
      //   // object with key backends, array value
      //   this.setState({
      //     satellites:  json.backends,
      //     currentSatellite: json.backends[0] || null
      //   });
      // })
      // .catch(err => {
      //   // do something
      // });   
    }
  }

  handleisLoggedIn = (id) => {
    this.setState({ isLoggedIn: id });
  };

  handleSelectedSatelliteChange = (id) => {
    this.setState({ currentSatellite: id });
  };

  handleLogout = () => {
    fetch(`${this.state.origin}/logout`, {
      method: 'POST'
    })
    .then(res => {
      this.setState({ isLoggedIn: false });
    })
    .catch(err => {
      this.setState({ isLoggedIn: false });
      // come back to this later
    });
  };

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
  };

  handleSignup = () => {
    this.setState({ isLoggedIn: true });
  };

  handleNewSatellite = (name) => {
    const context = this;
    const newSat = {
      id: 3,
      name,
      endpoint: 'random.localhost.com',
      apiKey: uuidv4(),
      files: false
    };

    // fetch POST to controller with new satellite

    this.setState({ loading: true });
      setTimeout(() => {
        context.setState({
          loading: false,
          satellites: context.state.satellites.concat(newSat),
          done: {
            type: 'success',
            msg: 'Satellite successfully launched.'
          }
        }, () => {
          context.setState({ 
 
          });
        })
      }, 2000);
  };

  handleDestroySatellite = () => {
    // fetch POST to controller to tear down satellite

    const context = this;

    this.setState({ 
      loadingDestroy: true 
    }, () => {
      setTimeout(() => {
        // fetch, check res status code

        let res = {
          status: 200
        };

        if (res.status !== 200) {
          context.setState({
            loadingDestroy: false,
            doneDestroy: {
              type: 'danger',
              msg: 'Satellite could not be destroyed.'
            }
          });

          return;
        }

        const updatedSatellites = this.state.satellites.filter(satellite => satellite.id !== this.state.currentSatellite);

        context.setState({ 
          loadingDestroy: false,
          doneDestroy: {
            type: 'success',
            msg: "Satellite successfully destroyed."
          },
          satellites: updatedSatellites
        }, () => {
          if (context.state.satellites.length > 0) {
            context.setState({
              currentSatellite: context.state.satellites[0]
            });
          } else {
            context.setState({
              currentSatellite: null
            });
          }
        });
      }, 2000);
    });
  };

  handleClearDone = () => {
    this.setState({ done: null });
  };

  handleClearDoneDestroy = () => {
    this.setState({ doneDestroy: null });
  };

  getCurrentSatellite = () => {
    return this.state.satellites.filter(function(sat) {
      return sat.id === this.state.currentSatellite;
    }, this)[0];
  };

  render() { 
    const satellite = this.getCurrentSatellite();

    return (
      <div className="App">
        <Router>
          <Switch>
            <PublicRoute 
              component={Authentication}
              path="/login"
              onLogin={this.handleLogin}
              origin={this.state.origin}
              isLoggedIn={this.state.isLoggedIn}
            />
            <PublicRoute 
              component={Authentication}
              path="/register"
              onSignup={this.handleSignup}
              origin={this.state.origin}
              isLoggedIn={this.state.isLoggedIn}
            />
            <ProtectedRoute 
              component={Dashboard}
              path="/"
              isLoggedIn={this.state.isLoggedIn}
              satellites={this.state.satellites}
              currentSatellite={this.state.currentSatellite}
              changeSatellite={this.handleSelectedSatelliteChange}
              handleNewSatellite={this.handleNewSatellite}
              handleLogout={this.handleLogout}
              handleClearDone={this.handleClearDone}
              loading={this.state.loading}
              done={this.state.done}
              satellite={satellite}
              handleDestroySatellite={this.handleDestroySatellite}
              loadingDestroy={this.state.loadingDestroy}
              doneDestroy={this.state.doneDestroy}
              clearDone={this.handleClearDoneDestroy}
            />
          </Switch>
        </Router>
      </div>
    );
  }
};

export default App;
