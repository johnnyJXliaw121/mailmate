import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Card from './Card'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import MiniCard from './MiniCard'
import {assignLabelToMail, removeLabelFromMail} from "../api/Labels"
import Navbar from './Navbar'
import image from '../Background/background.jpg'
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

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

const grid = 12;

const getListStyle = isDraggingOver => ({
  marginBottom:'2%',
  marginTop:'2%',
  marginRight:'1%',
  background: isDraggingOver
    ? 'lightblue'
    : '#F0F0F0',
  padding: grid,
  width: 300
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
        <Grid container direction="row"
              justify="center"
              alignItems="flex-start" className={this.props.classes.root} spacing={2}>
    <DragDropContext onDragEnd={this.onDragEnd} style={{width: '100%'}}>
        {/* Unreads */}

        <Droppable droppableId="unreads" style={{paddingLeft: '50px'}}>
          {/*<Grid item xs={12}>*/}
            {
                (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    <div style={{display:'flex',marginLeft: '35%',marginRight: '30%'}} >
                        <h2 style={{marginRight:'1%'}}>Unreads</h2>
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
          {/*</Grid>*/}
        </Droppable>
      <Droppable droppableId="urgents">
        {/*<Grid item xs={12}>*/}
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            <div style={{display:'flex',marginLeft: '35%',marginRight: '30%'}} >
              <h2 style={{marginRight:'1%'}}>Urgent</h2>
            </div>
            {
              this.props.urgents.map((output, index) => {
                let name = output.From.substring(0, output.From.indexOf("<"));

                var mydate = new Date(output.Date);

                var now = new Date();

                var diff = Math.abs(now - mydate);


                var finalTime = this.timeConversation(diff)
                return (<MiniCard id={output.id} finalTime={finalTime} index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} label="sales"/>)

              })
            }
            {provided.placeholder}
          </div>)
        }
        {/*</Grid>*/}
      </Droppable>
      {/* Sales */}
      <Droppable droppableId="sales" >
        {/*<Grid item xs={12}>*/}
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} >
            <div style={{display:'flex',marginLeft: '28%', textAlign: 'center'}}>
            <h2 style={{marginRight:'1%',color:'rgb(42,20,12'}}>Client To Do's</h2>
            </div>
            {
              this.props.sales.map((output, index) => {
                let name = output.From.substring(0, output.From.indexOf("<"));

                var mydate = new Date(output.Date);
               
                var now = new Date();
             
                var diff = Math.abs(now - mydate);

                
                var finalTime = this.timeConversation(diff)

                return (<MiniCard id={output.id} finalTime={finalTime} index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body} handleDelete={this.props.handleDelete} label="sales"/>)
              })
            }
            {provided.placeholder}
          </div>)
        }
        {/*</Grid>*/}
      </Droppable>
      {/* Drafts */}
      <Droppable droppableId="drafts" style={{marginTop:'3%',marginBottom:'3%'}}>
        {/*<Grid item xs={12}>*/}
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            <div style={{display:'flex',marginLeft: '38%',marginRight: '30%',color:'rgb(42,20,12)'}}>
              <h2 style={{marginRight:'1%'}}>Drafts</h2>
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
        {/*</Grid>*/}
      </Droppable>

    </DragDropContext>
  </Grid>
    );
  }
}

const styler = {
  backgroundContainer: {
    backgroundImage: `url(${ image })`
  },
}
// Put the things into the DOM!
export default withStyles(styler)(Home)
