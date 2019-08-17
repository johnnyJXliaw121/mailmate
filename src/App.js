import React, { Component } from 'react';
import firebase from "firebase"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
// import SignIn from './Components/SignIn'
import SignIn2 from './Components/SignIn2'
import gapi , {callGAPI} from "./google_api"


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignedIn: null
    }
    // Set google apps api listener
    callGAPI(()=>{
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
        console.log("Signed in = ", isSignedIn)})      
    },
    // On Error
    (error)=> console.log("There was a GAPI authenitcation error", error)
    )

    //Set firebase Auth state Listener
      // firebase.auth().onAuthStateChanged(user => {
      // if (user){
      //         this.setState({isSignedIn:true, user: user})
      //         }else{
      //         this.setState({isSignedIn:false, user: null})
      //         }
              
      // })
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


