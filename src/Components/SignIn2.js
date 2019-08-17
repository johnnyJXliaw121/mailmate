import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from "firebase"
import gapi, {callGAPI}from "../google_api"

class SignIn2 extends Component {
    constructor(props){
        super(props)
        callGAPI(()=>{
            gapi.auth2.getAuthInstance().signIn();
        })
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
