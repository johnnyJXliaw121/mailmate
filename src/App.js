import React, { Component } from 'react';
// import SignIn from './Components/SignIn'
import SignIn2 from './Components/SignIn2'
import base64url from 'base64url'
import { auth } from 'firebase/app'
import {getListOfLabels} from "./api/Labels";
import {
  getIdsFromUnreadList,
  getListOfUnreadMails,
  sendEmail,
  getMailFromId,
  getEmailBodyFromEmailResponse,
  getSubjectFromEmailResponse,
  getSenderFromEmailResponse,
  getSnippetFromEmailResponse,
  getUnreadMailInfo
} from "./api/Email";
import {
  getDraftFromId,
  getListOfDraftMails,
  getSenderFromDraftResponse,
  getIdsFromDraftList,
  createDraftMail, getBodyFromDraftResponse, getSubjectFromDraftResponse, getTextFromDraftMailById, getTextFromDraftMail
} from "./api/Draft";

import Board from 'react-trello'


var gapi = window.gapi

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

      // Set listener for future GAPI authentication state changes
      gapiInstance.isSignedIn.listen((isSignedIn)=>{
        this.setState({isSignedIn: isSignedIn})
        console.log("Signed in = ", isSignedIn)

        // ==== GAPI API CALLS ======
        var from = "MailMate <mailmate.aus@gmail.com>"
        var to = "Johnny Liaw <johnnyliaw121@gmail.com>"
        var subject = "Random Email"
        var message = "hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!"

        getListOfUnreadMails().then((unreads) => {
          this.setState({unreads: getUnreadMailInfo(unreads)})
        })
        // getListOfDraftMails().then((response) => {
        //   let ids = getIdsFromDraftList(response)
        //   console.log(ids)
        //   ids.forEach((id) => {
        //
        //   getDraftFromId(id).then((draft) => {
        //     console.log(draft)
        //     console.log(getTextFromDraftMail(draft))
        //   })
        //   })
        // })

        // createDraftMail(from, to, subject, message).then(()=>{
        //   console.log("success!")
        // })

      })


  }
  

  render () {
    const data = {

        lanes: [
          {
            "id": "PLANNED",
            "title": "Planned Tasks",
            "label": "20/70",
            "style": {
              "width": 280
            },
            "cards": [
              {
                "id": "Milk",
                "title": "Buy milk",
                "label": "15 mins",
                "description": "2 Gallons of milk at the Deli store"
              },
              {
                "id": "Plan2",
                "title": "Dispose Garbage",
                "label": "10 mins",
                "description": "Sort out recyclable and waste as needed"
              },
              {
                "id": "Plan3",
                "title": "Write Blog",
                "label": "30 mins",
                "description": "Can AI make memes?"
              },
              {
                "id": "Plan4",
                "title": "Pay Rent",
                "label": "5 mins",
                "description": "Transfer to bank account"
              }
            ]
          },
          {
            "id": "WIP",
            "title": "Work In Progress",
            "label": "10/20",
            "style": {
              "width": 280
            },
            "cards": [
              {
                "id": "Wip1",
                "title": "Clean House",
                "label": "30 mins",
                "description": "Soap wash and polish floor. Polish windows and doors. Scrap all broken glasses"
              }
            ]
          },
          {
            "id": "BLOCKED",
            "title": "Blocked",
            "label": "0/0",
            "style": {
              "width": 280
            },
            "cards": []
          },
          {
            "id": "COMPLETED",
            "title": "Completed",
            "style": {
              "width": 280
            },
            "label": "2/5",
            "cards": [
              {
                "id": "Completed1",
                "title": "Practice Meditation",
                "label": "15 mins",
                "description": "Use Headspace app"
              },
              {
                "id": "Completed2",
                "title": "Maintain Daily Journal",
                "label": "15 mins",
                "description": "Use Spreadsheet for now"
              }
            ]
          },
          {
            "id": "REPEAT",
            "title": "Repeat",
            "style": {
              "width": 280
            },
            "label": "1/1",
            "cards": [
              {
                "id": "Repeat1",
                "title": "Morning Jog",
                "label": "30 mins",
                "description": "Track using fitbit"
              }
            ]
          },
          {
            "id": "ARCHIVED",
            "title": "Archived",
            "style": {
              "width": 280
            },
            "label": "1/1",
            "cards": [
              {
                "id": "Archived1",
                "title": "Go Trekking",
                "label": "300 mins",
                "description": "Completed 10km on cycle"
              }
            ]
          },
          {
            "id": "ARCHIVED2",
            "title": "Archived2",
            "style": {
              "width": 280
            },
            "label": "1/1",
            "cards": [
              {
                "id": "Archived2",
                "title": "Go Jogging",
                "label": "300 mins",
                "description": "Completed 10km on cycle"
              }
            ]
          },
          {
            "id": "ARCHIVED3",
            "title": "Archived3",
            "style": {
              "width": 280
            },
            "label": "1/1",
            "cards": [
              {
                "id": "Archived3",
                "title": "Go Cycling",
                "label": "300 mins",
                "description": "Completed 10km on cycle"
              }
            ]
          }
        ]
      
    }
    let view = <div></div>
    if (this.state.isSignedIn == true){
      // ======= INSERT HOME BELOW =========
      // the view below is the layout for 1 row 3 column for design
      view = <Board data={data} draggable />

      
    }
    else if (this.state.isSignedIn === false && this.state.isSignedIn != null){
      view = <div>Not Signed In<SignIn2 /></div>
    } else {
      view = <div> Pending Authentication Update </div>
    }
    return (
        <div className="App" style={{height:'50em',background: "linear-gradient(90deg, #77c9d4, #57bc90)"}}>
          {view}
        </div>
    )
  }
}

export default App;


