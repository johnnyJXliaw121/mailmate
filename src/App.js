import React, {Component} from 'react';
// import SignIn from './Components/SignIn
import base64url from 'base64url'
import {auth} from 'firebase/app'
import SignIn2 from './Components/SignIn2';
import Modal from 'react-responsive-modal';
import {Editor} from 'slate-react';
import {Value} from 'slate';
import {Button, Icon, Toolbar} from './Components/components'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  sendEmail,
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
// import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Home from "./Components/Home";
import {getListOfLabelData, getAllMailWithLabel, getLabelNamesFromLabelData, getAllMailIdWithlabel} from './api/Labels';

var gapi = window.gapi

const DEFAULT_NODE = 'paragraph'

// this is for the modal
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: 'A line of text in a paragraph.'
          }
        ]
      }
    ]
  }
})

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

function BoldMark(props) {
  return <strong>{props.children}</strong>
}
function CodeNode(props) {
  return (<pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>)
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: getItems(10),
      selected: getItems(5, 10),
      isSignedIn: null,

      open: false,
      title: '',
      value: initialValue,
      textBox: '<p>Hello World</p>',
      drafts: [],
      sales: [],
      unreads: []

    };
    // ================ Initializes Gapi Auth ====================
    // this.getListOfLabels = getListOfLabels().bind(this)

  }
  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const {value} = this.state
    return value.activeMarks.some(mark => mark.type === type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const {value} = this.state
    return value.blocks.some(node => node.type === type)
  }

  onOpenModal = (titleReceived) => {
    this.setState({open: true, title: titleReceived});
  };

  onCloseModal = () => {
    this.setState({open: false});
  };
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
      // getAllMailIdWithlabel('Label_6111354806179621733').then(out => {
      //   console.log('getall mail with id', out)
      // })
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

  handleClick = (item) => {
    console.log(item)
  }

  onChange = ({value}) => {
    this.setState({value})
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {

    const {open} = this.state;

    let view = <div></div>
    if (this.state.isSignedIn === true) {
      // ======= INSERT HOME BELOW =========
      // the view below is the layout for 1 row 3 column for design
      // view = (<DragDropContext onDragEnd={this.onDragEnd}>  {/* Drafts */}  <Droppable droppableId="drafts">  {  (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>  {  this.state.drafts.map((output, index) => {  return (<Draggable key={output.id} draggableId={output.id} index={index}>  {  (provided, snapshot) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>  {output.Subject}  </div>)  }  </Draggable>)  })   }  {provided.placeholder}  </div>)  }  </Droppable>  {/* Unreads */}  <Droppable droppableId="unreads">  {  (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>  {  this.state.unreads.map((output, index) => {  return (<Draggable key={output.id} draggableId={output.id} index={index}>  {  (provided, snapshot) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>  {output.Subject}  </div>)  }  </Draggable>)  })   }  {provided.placeholder}  </div>)  }  </Droppable>  <Droppable droppableId="droppable2">  {  (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>  {  this.state.selected.map((item, index) => (<Draggable key={item.id} draggableId={item.id} index={index}>  {  (provided, snapshot) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>  {item.content}  </div>)  }  </Draggable>))  }  {provided.placeholder}  </div>)  }  </Droppable>  </DragDropContext>);   } else if (this.state.isSignedIn === false && this.state.isSignedIn != null) {  view = <div>Not Signed In<SignIn2/></div> view = <Home drafts={this.state.drafts} unreads={this.state.unreads} sales={this.state.sales}/> =======

      view = <Home drafts={this.state.drafts} unreads={this.state.unreads} sales={this.state.sales}/>
      // the view below is the layout for 1 row 3 column for design
      // view = (<DragDropContext onDragEnd={this.onDragEnd}>
      //   {/* Drafts */}
      //   <Droppable droppableId="drafts">
      //     {
      //       (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
      //         {
      //           this.state.items.map((item, index) => (<div onClick={() => this.onOpenModal(item.id)}>
      //             <Draggable key={item.id} draggableId={item.id} index={index}>
      //
      //               {
      //                 (provided, snapshot) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
      //                   {item.content}
      //                 </div>)
      //               }
      //
      //             </Draggable>
      //
      //           </div>))
      //         }
      //         <Modal open={open} onClose={this.onCloseModal} center="center">
      //           <form style={{
      //               width: '50em',
      //               height: '30em'
      //             }}>
      //             <h1>Title</h1>
      //             <p>{this.state.title}</p>
      //             <h1>Body</h1>
      //
      //             <CKEditor editor={ClassicEditor} data={this.state.textBox} onInit={editor => {
      //                  You can store the "editor" and use when it is needed.
      //                 console.log('Editor is ready to use!', editor);
      //               }} onChange={(event, editor) => {
      //                 const data = editor.getData();
      //                 console.log({event, editor, data});
      //                 this.setState({textBox: data});
      //
      //               }} onBlur={editor => {
      //                 console.log('Blur.', editor);
      //               }} onFocus={editor => {
      //                 console.log('Focus.', editor);
      //               }}/>
      //             <div style={{
      //                 textAlign: 'center',
      //                 marginTop: '10em'
      //               }} onClick={() => sendEmail("MailMate <mailmate.aus@gmail.com>", "MailMate <mailmate.aus@gmail.com>", "test", "hello test message").then((resp) => console.log("email sent"))}>
      //               <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      //             </div>
      //           </form>
      //
      //         </Modal>
      //         {provided.placeholder}
      //       </div>)
      //     }
      //   </Droppable>
      //   <Droppable droppableId="droppable2">
      //     {
      //       (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
      //         {
      //           this.state.selected.map((item, index) => (<Draggable key={item.id} draggableId={item.id} index={index}>
      //             {
      //               (provided, snapshot) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
      //                 {item.content}
      //               </div>)
      //             }
      //           </Draggable>))
      //         }
      //         {provided.placeholder}
      //       </div>)
      //     }
      //   </Droppable>
      // </DragDropContext>);
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
