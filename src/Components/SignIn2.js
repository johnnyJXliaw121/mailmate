import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from "firebase"

let gapi = window.gapi

class SignIn2 extends Component {
    constructor(props){
        super(props)
        gapi.auth2.getAuthInstance().signIn();
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
