import React, {Component} from 'react';
// import SignIn from './Components/SignIn
import SignIn2 from './Components/SignIn2';
import {
  // sendEmail,
  getIdsFromUnreadList,
  getListOfUnreadMails,
  getEmailById,
  // getEmailRawFromId,
  // getBodyFromEmailResponse,
  // getHeadersFromEmailResponse
} from "./api/Email";
import {
  // getDraftRawFromId,
  getListOfDraftMails,
  getIdsFromDraftList,
  // createDraftMail,
  // getBodyFromDraftResponse,
  // getHeadersFromDraftResponse,
  // getDraftFromDraftResponse,
  getDraftById
} from "./api/Draft"
import Home from "./Components/Home";
import {
  getListOfLabelData,
  // getAllMailWithLabel,
  getLabelNamesFromLabelData,
  getAllMailIdWithlabel
} from './api/Labels';

var gapi = window.gapi

// a little function to help us with reordering the result

/**
 * Moves an item from one list to another list.
 */

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignedIn: null,
      drafts: [],
      sales: [],
      unreads: [],
      urgents: []
    };
    this.handleDelete = this.handleDelete.bind(this)
    this.reorder = this.reorder.bind(this)
    this.move = this.move.bind(this)

      let gapiInstance = gapi.auth2.getAuthInstance()
      gapiInstance.then(
      //On Init Function
      () => {
        //Check if it is signed in now!
        this.setState({isSignedIn: gapiInstance.isSignedIn.get()})
        console.log("Initial GAPI State", this.state.isSignedIn)
      })

      // Set listener for future GAPI authentication state changes
      gapiInstance.isSignedIn.listen((isSignedIn) => {
        this.setState({isSignedIn: isSignedIn})
        console.log("Signed in = ", isSignedIn)
        if (isSignedIn) {
          // ==== GAPI API CALLS ======
          // ==== Unread Email Calls ==
          let unreads = []
          getListOfUnreadMails().then((output) => {
            let ids = getIdsFromUnreadList(output)

            ids.forEach(id => {
              getEmailById(id).then((output) => {
                unreads.push(output)
                this.setState({unreads: unreads})
              })
            })
          })

          // ==== Draft Calls
          let drafts = [];
          getListOfDraftMails().then((response) => {
            let ids = getIdsFromDraftList(response)
            ids.forEach((id) => {
              getDraftById(id).then((output) => {
                drafts.push(output)
                this.setState({drafts: drafts})
              })
            })
          })

          // ===== Label Calls ======
          // getListOfLabelData().then(labels => {
          //   console.log('List of label Data', labels)
          //   console.log('label names', getLabelNamesFromLabelData(labels))
          // })

          let sales = [];
          getAllMailIdWithlabel('Label_6111354806179621733').then((response) => {
            let ids = response
            ids.forEach((id) => {
              getEmailById(id).then((output) => {
                sales.push(output)
                this.setState({sales: sales})
              })
            })
          })

          let urgents = [];
          getAllMailIdWithlabel("Label_5377739233345144947").then((response) => {
            let ids = response
            ids.forEach((id) => {
              getEmailById(id).then((output) => {
                urgents.push(output)
                this.setState({urgents: urgents})
              })
            })
          })
        }
      })
  }

  reorder(id, startIndex, endIndex) {
    let list = this.state[id]
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    this.setState({[id]: result})
  };

  move(sourceId, destinationId, droppableSource, droppableDestination) {
    let source = this.state[sourceId]
    let destination = this.state[destinationId]
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);

    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    this.setState({[sourceId]: sourceClone});
    this.setState({[destinationId]: destClone});
  };

  handleDelete(mail_id, label) {
    let newMailArray = this.state[label].filter((item) => {
      return item.id != mail_id
    })
    this.setState({[label]: newMailArray})
  }

  render() {
    let view = <div></div>
    if (this.state.isSignedIn === true) {
      // ======= INSERT HOME BELOW =========
      view = <Home drafts={this.state.drafts} unreads={this.state.unreads} sales={this.state.sales} urgents={this.state.urgents} handleDelete={this.handleDelete} reorder={this.reorder} move={this.move}/>
    } else if (this.state.isSignedIn === false && this.state.isSignedIn != null) {
      view = <div>Not Signed In<SignIn2/></div>
    } else {
      view = <div>
        Pending Authentication Update
      </div>
    }

    return (view);

  }
}

// Put the things into the DOM!
export default App;