import React, { Component } from 'react';
import firebase from "firebase"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
// import SignIn from './Components/SignIn'
import SignIn2 from './Components/SignIn2'
import { auth } from 'firebase/app'
import {getListOfLabels} from "./gmail_api";

let gapi = window.gapi

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignedIn: null
    }
    // this.getListOfLabels = getListOfLabels().bind(this)
      let gapiInstance = gapi.auth2.getAuthInstance()
      gapiInstance.then(
        //On Init Function
        ()=>{
      //Check if it is signed in now!
      this.setState({isSignedIn:gapiInstance.isSignedIn.get()})
      console.log("Initial GAPI State",this.state.isSignedIn)
      })
      // Set listener for future GAPI authentication state changes
      gapiInstance.isSignedIn.listen((isSignedIn)=>{
        this.setState({isSignedIn: isSignedIn})
        console.log("Signed in = ", isSignedIn)

        getListOfLabels().then((response) => {
          this.setState({
            response
          })
        })

      })
  }
  updateGapiState(isSignedIn){
      if(isSignedIn) {
      console.log("Google Apps Successfully signed in! ==============")
      }
  }
  render () {
    let view = <div></div>
    if (this.state.isSignedIn == true){
      view = <div>Signed In!</div>
    }
    else if (this.state.isSignedIn === false && this.state.isSignedIn != null){
                view = <div>Not Signed In<SignIn2 /></div>
    }else {
      view = <div> Pending Authentication Update </div>
    }
    return (
        <div className="App">
          {view}
        </div>
    )
  }
}

export default App;


