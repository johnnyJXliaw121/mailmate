import React, {Component} from 'react';
// import SignIn from './Components/SignIn'
import SignIn2 from './Components/SignIn2'
// import base64url from 'base64url'
// import {auth} from 'firebase/app'
// import {getListOfLabels} from "./api/Labels";
import {
  // getIdsFromUnreadList,
  getListOfUnreadMails,
  // sendEmail,
  // getMailFromId,
  // getEmailBodyFromEmailResponse,
  // getSubjectFromEmailResponse,
  // getSenderFromEmailResponse,
  // getSnippetFromEmailResponse,
  getUnreadMailInfo
} from "./api/Email";
import {
  // getDraftFromId,
  // getListOfDraftMails,
  // getSenderFromDraftResponse,
  // getIdsFromDraftList,
  // createDraftMail,
  // getBodyFromDraftResponse,
  // getSubjectFromDraftResponse,
  // getTextFromDraftMailById,
  // getTextFromDraftMail
} from "./api/Draft";

import Board from 'react-trello'

var gapi = window.gapi

// const rawMessage = "From: mailmate.aus@gmail.com\r\n" + "To: johnnyliaw121@gmail.com\r\n>" + "Subject: My First Draft Email\r\n\r\n" + "The message text goes here"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignedIn: null
    }
    // ================ Initializes Gapi Auth ====================
    // this.getListOfLabels = getListOfLabels().bind(this)

  }

  componentWillMount() {
    let gapiInstance = gapi.auth2.getAuthInstance()
    gapiInstance.then(
    //On Init Function
    () => {
      //Check if it is signed in now!
      this.setState({isSignedIn: gapiInstance.isSignedIn.get()})
      console.log("Initial GAPI State", this.state.isSignedIn)
      let currentUser = gapiInstance.currentUser.get()
      currentUser.reloadAuthResponse().then((resp) => {
        console.log(resp)
      })
    })

    // Set listener for future GAPI authentication state changes
    gapiInstance.isSignedIn.listen((isSignedIn) => {
      this.setState({isSignedIn: isSignedIn})
      console.log("Signed in = ", isSignedIn)

      // ==== GAPI API CALLS ======
      // var from = "MailMate <mailmate.aus@gmail.com>"
      // var to = "Johnny Liaw <johnnyliaw121@gmail.com>"
      // var subject = "Random Email"
      // var message = "hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!hello world world world!"

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

      // getListOfUnreadMails().then((unreads) => {
      //   unreads = getUnreadMailInfo(unreads)
      //   this.setState({unreads: unreads});
      // })
      // {
      let unreads = [
        {
          body: "body",
          id: "id",
          sender: "sender",
          snippet: "snippet",
          subject: "subject"
        }, {
          body: "body",
          id: "id",
          sender: "sender",
          snippet: "snippet",
          subject: "subject"
        }
      ]

      unreads = unreads.map(x => {
        return {"id": x.id, "title": x.subject, "label": x.sender, "description": x.snippet}
      })

      this.setState({"unreads": unreads})
    })
  }

  render() {
    // let createCards = () => {
    //   try {
    //     console.log('this.state.unreads[1]', this.state.unreads[1]);
    //   } catch (e) {}
    //   return this.state.unreads !== undefined
    //    && this.state.unreads[0].subject !== undefined
    //     ? (this.state.unreads.map(x => {
    //       return {"id": x.id, "title": x.subject, "label": x.sender, "description": x.snippet}
    //     }))
    //     : []
    // }

    const data = {
      // TODO: label is number of emails
      lanes: [
        {
          "id": "inbox",
          "title": "Inbox",
          "label": "20/70",
          "style": {
            "width": 280
          },
          // "cards": createCards()
          // cards: this.state.unreads
          cards: this.state.unreads
        }, {
          "id": "urgent",
          "title": "Urgent",
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
        }, {
          "id": "drafts",
          "title": "Drafts",
          "label": "0/0",
          "style": {
            "width": 280
          },
          "cards": []
        }
      ]

    }
    let view = <div></div>
    if (this.state.isSignedIn === true) {
      // ======= INSERT HOME BELOW =========
      // the view below is the layout for 1 row 3 column for design
      view = <Board style={{
          background: "linear-gradient(90deg, #77c9d4, #57bc90)"
        }}
        // Style of BoardWrapper
        data={data} draggable="draggable"/>

    } else if (this.state.isSignedIn === false && this.state.isSignedIn != null) {
      view = <div>Not Signed In<SignIn2/></div>
    } else {
      view = <div>
        Pending Authentication Update
      </div>
    }
    return (<div className="App">
      {view}
    </div>)
  }
}

export default App;
