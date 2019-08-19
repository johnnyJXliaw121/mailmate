import React, { Component } from 'react';
// import SignIn from './Components/SignIn'
import SignIn2 from './Components/SignIn2'
import base64url from 'base64url'
import { auth } from 'firebase/app'
import {getListOfLabels} from "./api/Labels";
import {getIdsFromUnreadList, getListOfUnreadMails, sendEmail} from "./api/Email";
import {
  getDraftFromId,
  getListOfDraftMails,
  getSenderFromDraftResponse,
  getIdsFromDraftList,
  createDraftMail
} from "./api/Draft";

let gapi = window.gapi

const rawMessage = "From: mailmate.aus@gmail.com\r\n" + "To: johnnyliaw121@gmail.com\r\n>" + "Subject: My First Draft Email\r\n\r\n" + "The message text goes here"


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
      let currentUser = gapiInstance.currentUser.get()
      currentUser.reloadAuthResponse().then((resp) => {
        console.log(resp)
      })
      })


      console.log(gapi.auth2.AuthResponse)
      // Set listener for future GAPI authentication state changes
      gapiInstance.isSignedIn.listen((isSignedIn)=>{
        this.setState({isSignedIn: isSignedIn})
        console.log("Signed in = ", isSignedIn)


        // ==== GAPI API CALLS ======

        sendEmail((base64url(rawMessage))).then(() => {
          console.log("Mail Drafted!")
        })
        // getListOfDraftMails().then((resp) => {
        //   console.log(resp)
        // })

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


