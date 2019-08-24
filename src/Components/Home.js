import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Card from './Card'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import MiniCard from './MiniCard'
import {assignLabelToMail, removeLabelFromMail} from "../api/Labels"

var gapi = window.gapi

/**
 * Moves an item from one list to another list.
 */
// function move(source, destination, droppableSource, droppableDestination) {
//   const sourceClone = Array.from(source);
//   const destClone = Array.from(destination);
//   const [removed] = sourceClone.splice(droppableSource.index, 1);
//
//   destClone.splice(droppableDestination.index, 0, removed);
//
//   const result = {};
//   result[droppableSource.droppableId] = sourceClone;
//   result[droppableDestination.droppableId] = destClone;
//
//   return result;
// };

const grid = 8;

const getListStyle = isDraggingOver => ({
  background: isDraggingOver
    ? 'lightblue'
    : 'lightgrey',
  padding: grid,
  width: 250
});

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      title: '',
      textBox: '<p>Hello World</p>'
    };
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd(result) {
    const {source, destination} = result;

    // dropped outside the list or from drafts
    if (!destination) {
      return;
    }

    // reorder inside
    console.log('source', source);
    if (source.droppableId === destination.droppableId) {
      this.props.reorder(source.droppableId, source.index, destination.index);
    } else {
      // Move
      if (source.droppableId === "drafts" || destination.droppableId === "drafts") {
        return;
      }
      const listIds = {
        unreads: "INBOX",
        sales: "Label_6111354806179621733",
        urgents: "Label_5377739233345144947"
      }

      let emailId = this.props[source.droppableId][source.index].id

      // let gapiInstance = gapi.auth2.getAuthInstance()
      // gapiInstance.then(
      // //On Init Function
      // () => {
      //   //Check if it is signed in now!
      //   this.setState({isSignedIn: gapiInstance.isSignedIn.get()})
      //   console.log("Initial GAPI State", this.state.isSignedIn)
      // })
      //
      // // Set listener for future GAPI authentication state changes
      // gapiInstance.isSignedIn.listen((isSignedIn) => {
      //   this.setState({isSignedIn: isSignedIn})
      //   console.log("Signed in = ", isSignedIn)
      //   if (isSignedIn) {
      //
      //     assignLabelToMail(listIds[destination.droppableId], emailId).then((response) => {
      //       console.log('response', response);
      //       removeLabelFromMail(listIds[source.droppableId], emailId).then((response) => {
      //
      //       })
      //     })
      //   }
      // })
      this.props.move(source.droppableId, destination.droppableId, source, destination);
      // move(this.getList(source.droppableId), this.getList(destination.droppableId), source, destination);
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (<DragDropContext onDragEnd={this.onDragEnd}>
      {/* Drafts */}
      <Droppable droppableId="drafts">
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            {
              this.props.drafts.map((output, index) => {
                let name = output.To.substring(0, output.To.indexOf("<"));
                return (<MiniCard id={output.id} index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} label="drafts"/>)
              })
            }
            {provided.placeholder}
          </div>)
        }
      </Droppable>
      {/* Unreads */}
      <Droppable droppableId="unreads">
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            {
              this.props.unreads.map((output, index) => {
                let name = output.From.substring(0, output.From.indexOf("<"));
                console.log(output)
                return (<MiniCard id={output.id} index={index} emailName={output.From} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} label="unreads"/>)
              })
            }
            {provided.placeholder}
          </div>)
        }
      </Droppable>
      {/* Sales */}
      <Droppable droppableId="sales">
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            {
              this.props.sales.map((output, index) => {
                let name = output.From.substring(0, output.From.indexOf("<"));
                return (<MiniCard id={output.id} index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} label="sales"/>)
              })
            }
            {provided.placeholder}
          </div>)
        }
      </Droppable>
      <Droppable droppableId="urgents">
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            {
              this.props.urgents.map((output, index) => {
                let name = output.From.substring(0, output.From.indexOf("<"));
                return (<MiniCard id={output.id} index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} label="sales"/>)
              })
            }
            {provided.placeholder}
          </div>)
        }
      </Droppable>
    </DragDropContext>);
  }
}

// Put the things into the DOM!
export default Home
