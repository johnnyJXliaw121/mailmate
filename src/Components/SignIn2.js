import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from "firebase"
class SignIn2 extends Component {
    componentDidMount() {
        window.gapi.load('client:auth2', () => {
            console.log(window.gapi)
            window.gapi.client.init({
                apiKey: 'AIzaSyBOAlQDyCFJra5LDxVflNSQPDX_cIuOc7k',
                clientId: '602273574158-v2c8nla22vif44l6r5shhr45uuhrpdd3.apps.googleusercontent.com',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
                scope: 'https://www.googleapis.com/auth/gmail.readonly'
            }).then(() => {
                window.gapi.signin2.render('mySignIn', {
                    window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get()))
            })
        })
    }
    }
    updateSignInStatus (isSignedIn) {
        if(isSignedIn) {
            console.log("Successfully signed in! ==============")
        }
    }
    // onSuccess () {
    //     console.log("Successfully Signed In")
    // }
    render () {
        return (
            <div id="mySignIn" />
        )
    }
}

export default SignIn2;
