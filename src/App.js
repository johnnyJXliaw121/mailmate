import React, { Component } from 'react';
// import SignIn from './Components/SignIn'
import SignIn2 from './Components/SignIn2'
import { auth } from 'firebase/app'
import {getListOfLabels} from "./api/Labels";
import {getIdsFromUnreadList, getListOfUnreadMails} from "./api/Email";
import {getDraftFromId, getListOfDraftMails, getSenderFromDraftResponse, getIdsFromDraftList} from "./api/Draft";


var gapi = window.gapi

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignedIn: null
    }
    // ================ Initializes Gapi Auth ====================
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

        // ==== GAPI API CALLS ======
        getListOfUnreadMails().then((response) => {
          console.log(getIdsFromUnreadList(response))
        })

      })
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


