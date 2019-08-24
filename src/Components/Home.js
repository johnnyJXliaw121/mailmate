import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Card from './Card'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import MiniCard from './MiniCard'
import {getListOfLabelData, getLabelNamesFromLabelData, assignLabelToMail, removeLabelFromMail} from "../api/Labels"

var gapi = window.gapi

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
      // assignLabelToMail(listIds[destination.droppableId], emailId).then((response) => {
      //   console.log('response', response);
      //    removeLabelFromMail(listIds[source.droppableId], emailId).then((response) => {
      //      console.log('response', response);
      //
      //    })
      // })
      // gapi.client.gmail.users.messages.modify({
      //     'userId': 'me',
      //     'id': destination.droppableId,
      //     'addLabelIds': emailId
      // }).then((response)=>{
      //   console.log('response', response);
      // })
      getListOfLabelData().then(labels => {
        console.log('List of label Data', labels)
        console.log('label names', getLabelNamesFromLabelData(labels))
      })
      this.props.move(source.droppableId, destination.droppableId, source, destination);
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
                return (<MiniCard id={output.id} index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} addDraft={this.props.addDraft} label="drafts"/>)
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
                return (<MiniCard id={output.id} index={index} emailName={output.From} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} addDraft={this.props.addDraft} label="unreads"/>)
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
                return (<MiniCard id={output.id} index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} addDraft={this.props.addDraft} label="sales"/>)
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
                return (<MiniCard id={output.id} index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} addDraft={this.props.addDraft} label="sales"/>)
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
