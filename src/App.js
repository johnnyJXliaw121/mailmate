import React, { Component } from 'react';
import firebase from "firebase"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import SignIn from './Components/SignIn'

// firebase.initializeApp({
//   apiKey: "AIzaSyCKY4jyeVG42EIKO_rUtt92HTvgGA6gTyg",
//   authDomain: "quickstart-1565933663522.web.app"
// })

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignedIn: false
    }
    this.changeView = this.changeView.bind(this)
  }
  changeView() {
    this.setState({
      isSignedIn: true
    })
  }
  render () {
    return (
        <div className="App">
          {this.state.isSignedIn ? (
                  <div>Signed In!</div>
              )
              :
              (
                  <SignIn changeView={this.changeView} />
              )
          }
        </div>
    )
  }
}

export default App;
