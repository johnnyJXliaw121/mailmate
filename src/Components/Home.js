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
  marginBottom:'2%',
  marginTop:'2%',
  marginRight:'1%',
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

  handleClick() {
    console.log("YEE MOTHERUCKER")
  }

  timeConversation=(millisec) =>{
    var seconds = (millisec / 1000).toFixed(1);
    var minutes = (millisec / (1000 * 60)).toFixed(1);

    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days"
    }
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      
    <DragDropContext onDragEnd={this.onDragEnd}>
      <div style={{fontSize:'56px',fontWeight:'bold',fontFamily: 'Montserrat, sans-serif',marginTop:'20%',marginLeft:'3%',marginRight:'10%'}}>
        <div style={{position: 'fixed',
  width: '150px',color:'rgb(235,45,79)'
 }}>
        Mail   &nbsp;Mate
        </div>
        </div>
      {/* Drafts */}
      <Droppable droppableId="drafts" style={{marginTop:'3%',marginBottom:'3%'}}>
        
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
          <div style={{display:'flex',marginLeft: '30%',marginRight: '30%',color:'rgb(42,20,12)'}}>
            <h2 style={{marginRight:'1%'}}>Drafts</h2>
            <img style={{marginTop:'10%',color:'rgb(42,20,12)'}} src="https://image.flaticon.com/icons/png/512/46/46064.png" alt="Smiley face" height="42" width="42"></img>
            </div>
            {
              this.props.drafts.map((output, index) => {
                let name = output.To.substring(0, output.To.indexOf("<"));
                console.log(output.Date);
                var mydate = new Date(output.Date);
               
                var now = new Date();
             
                var diff = Math.abs(now - mydate);

                
                var finalTime = this.timeConversation(diff)
                
                return (
                  
                <MiniCard id={output.id} finalTime = {finalTime } index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} label="drafts"/>
                
                )

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
            <div style={{display:'flex',marginLeft: '25%',marginRight: '30%'}} >
            <h2 style={{marginRight:'1%'}}>Unreads</h2>
            <img style={{marginTop:'5%',fill:'#EF8200',stroke:'#EF8200'}} src="https://cdn.iconscout.com/icon/premium/png-256-thumb/mark-as-unread-1487398-1258556.png" alt="Smiley face" height="42" width="42"></img>
            </div>
            {
              this.props.unreads.map((output, index) => {
                let name = output.From.substring(0, output.From.indexOf("<"));
                console.log(output)

                var mydate = new Date(output.Date);
               
                var now = new Date();
             
                var diff = Math.abs(now - mydate);

                
                var finalTime = this.timeConversation(diff)
                return (<MiniCard id={output.id} finalTime = {finalTime } index={index} emailName= {output.From} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} label="unreads"/> )

              })
            }
            {provided.placeholder}
          </div>)
        }
      </Droppable>
      {/* Sales */}
      <Droppable droppableId="sales" >
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} >
            <div style={{display:'flex',marginLeft: '30%',marginRight: '30%'}}>
            <h2 style={{marginRight:'1%',color:'rgb(42,20,12'}}>Sales</h2>
            <img style={{marginTop:'10%',fill:'#EF8200',stroke:'#EF8200'}} src="https://svgur.com/i/EfU.svg" alt="Smiley face" height="42" width="42"></img>
            </div>
            {
              this.props.sales.map((output, index) => {
                let name = output.From.substring(0, output.From.indexOf("<"));

                var mydate = new Date(output.Date);
               
                var now = new Date();
             
                var diff = Math.abs(now - mydate);

                
                var finalTime = this.timeConversation(diff)

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
    </DragDropContext>
    );
  }
}

// Put the things into the DOM!
export default Home
