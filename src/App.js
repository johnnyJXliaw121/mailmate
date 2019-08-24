import React, {Component} from 'react';
// import SignIn from './Components/SignIn'
import SignIn2 from './Components/SignIn2'
import base64url from 'base64url'
import {auth} from 'firebase/app'
import {
  assignLabelToMail,
  createNewLabel,
  getAllMailIdWithlabel,
  getAllMailWithlabel,
  getAllMailWithLabel,
  getListOfLabelData,
  getListOfLabelMetadata,
  getListOfLabelNames,
  getListOfLabels,
  getListOfLabelsRaw,
  removeLabelFromMail
} from "./api/Labels";
import {
  getIdsFromUnreadList,
  getListOfUnreadMails,
  getEmailById,
  getEmailRawFromId,
  getBodyFromEmailResponse,
  getHeadersFromEmailResponse
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

// import ReactDOM from 'react-dom';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Home from "./Components/Home";

var gapi = window.gapi

// fake data generator
const getItems = (count, offset = 0) => Array.from({
  length: count
}, (v, k) => k).map(k => ({
  id: `item-${k + offset}`,
  content: `item ${k + offset}`
}));

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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging
    ? 'lightgreen'
    : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver
    ? 'lightblue'
    : 'lightgrey',
  padding: grid,
  width: 250
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: getItems(10),
      selected: getItems(5, 10),
      isSignedIn: null,
      drafts: [],
      unreads: []
    };
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
      // currentUser.reloadAuthResponse().then((resp) => {
      //   console.log(resp)
      // })
    })

    // Set listener for future GAPI authentication state changes
    gapiInstance.isSignedIn.listen((isSignedIn) => {
      this.setState({isSignedIn: isSignedIn})
      console.log("Signed in = ", isSignedIn)

      // ==== GAPI API CALLS ======
      // ==== Unread Email Calls ==
      let unreads = []
      getListOfUnreadMails().then((output) => {
        let ids = getIdsFromUnreadList(output)

        ids.forEach(id => {
          getEmailById(id).then((output) => {
            console.log('output', output);
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
    })
  }

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: 'items',
    droppable2: 'selected'
  };

  getList = id => this.state[this.id2List[id]];

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

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    let view = <div></div>
    if (this.state.isSignedIn === true) {
      // ======= INSERT HOME BELOW =========
      //    the view below is the layout for 1 row 3 column for design
      //   view = (<DragDropContext onDragEnd={this.onDragEnd}>
      //     {/* Drafts */}
      //     <Droppable droppableId="drafts">
      //       {
      //         (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
      //           {
      //             this.state.drafts.map((output, index) => {
      //               return (<Draggable key={output.id} draggableId={output.id} index={index}>
      //                 {
      //                   (provided, snapshot) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
      //                     {output.Subject}
      //                   </div>)
      //                 }
      //               </Draggable>)
      //             })
      //
      //           }
      //           {provided.placeholder}
      //         </div>)
      //       }
      //     </Droppable>
      //     {/* Unreads */}
      //     <Droppable droppableId="unreads">
      //       {
      //         (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
      //           {
      //             this.state.unreads.map((output, index) => {
      //               return (<Draggable key={output.id} draggableId={output.id} index={index}>
      //                 {
      //                   (provided, snapshot) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
      //                     {output.Subject}
      //                   </div>)
      //                 }
      //               </Draggable>)
      //             })
      //
      //           }
      //           {provided.placeholder}
      //         </div>)
      //       }
      //     </Droppable>
      //     <Droppable droppableId="droppable2">
      //       {
      //         (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
      //           {
      //             this.state.selected.map((item, index) => (<Draggable key={item.id} draggableId={item.id} index={index}>
      //               {
      //                 (provided, snapshot) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
      //                   {item.content}
      //                 </div>)
      //               }
      //             </Draggable>))
      //           }
      //           {provided.placeholder}
      //         </div>)
      //       }
      //     </Droppable>
      //   </DragDropContext>);
      //
      // } else if (this.state.isSignedIn === false && this.state.isSignedIn != null) {
      //   view = <div>Not Signed In<SignIn2/></div>
      view = <Home drafts={this.state.drafts} unreads={this.state.unreads}/>
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
