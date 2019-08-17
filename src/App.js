import React, { Component } from 'react';
import firebase from "firebase"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import SignIn from './Components/SignIn'
import SignIn2 from './Components/SignIn2'

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
    firebase.auth().onAuthStateChanged(user => {
    if (user){
            this.setState({isSignedIn:true, user: user})
            }else{
            this.setState({isSignedIn:false, user: null})
            }
            
    })
  }
  render () {
    return (
        <div className="App">
          {this.state.isSignedIn ? (
                  <div>Signed In!</div>
              )
              : // If not signed in - display Sign in view
              (
                  <SignIn2 />
              )
          }
        </div>
    )
  }
}

export default App;
