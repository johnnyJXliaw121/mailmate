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
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignedIn: null,
      drafts: [],
      sales: [],
      unreads: []

    };
  }
  componentWillMount() {
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
      if (isSignedIn){
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
      getListOfLabelData().then(labels => {
        console.log('List of label Data', labels)
        console.log('label names', getLabelNamesFromLabelData(labels))
      })

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
    }
    })
  }

  onDragEnd = result => {
    const {source, destination} = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(this.getList(source.droppableId), source.index, destination.index);

      let state = {
        items
      };

      if (source.droppableId === 'droppable2') {
        state = {
          selected: items
        };
      }

      this.setState(state);
    } else {
      const result = move(this.getList(source.droppableId), this.getList(destination.droppableId), source, destination);

      this.setState({items: result.droppable, selected: result.droppable2});
    }
  };

  render() {
    let view = <div></div>
    if (this.state.isSignedIn === true) {
      // ======= INSERT HOME BELOW =========
      view = 
      
      <Home style={{background: "linear-gradient(90deg, #77c9d4, #57bc90)"}}
      drafts={this.state.drafts} unreads={this.state.unreads} sales={this.state.sales}/>
      
    } else if (this.state.isSignedIn === false && this.state.isSignedIn != null) {
      view = <div>Not Signed In<SignIn2/></div>
    } else {
      view = <div>
        Pending Authentication Update
      </div>
    }

    return (      view
      );

  }
}

// Put the things into the DOM!
export default App;
