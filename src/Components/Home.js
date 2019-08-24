import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Card from './Card'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import MiniCard from './MiniCard'

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
  state = {
    items: getItems(10),
    selected: getItems(5, 10),
    open: false,
    title: '',
    textBox: '<p>Hello World</p>'
  };

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
                  
                <MiniCard id={output.id} finalTime = {finalTime } index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body}/>
                
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
                return (<MiniCard id={output.id} finalTime = {finalTime } index={index} emailName= {output.From} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body}/>)
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
                return (<MiniCard id={output.id} finalTime = {finalTime } index={index} sender={name} subject={output.Subject} snippet={output.Snippet} body={output.body}/>)
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
