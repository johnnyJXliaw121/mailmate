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
  background: isDraggingOver
    ? 'lightblue'
    : 'lightgrey',
  padding: grid,
  width: 250
});

class Home extends Component {
  state = {
    items: getItems(10),
    selected: getItems(5, 10)
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

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (<DragDropContext onDragEnd={this.onDragEnd}>
      <Droppable droppableId="droppable">
        {
          (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            {
              this.props.drafts.map((output, index) => {
                console.log('output', output);
                let name = output.To.substring(0, output.To.indexOf("<"));
                return (<MiniCard id={output.id} index={index} sender={name} subject={output.Subject} snippet={output.Snippet}/>)
              })
            }
            {provided.placeholder}
          </div>)
        }
      </Droppable>
      {/* <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {this.state.selected.map((item, index) => (
                                <MiniCard item={item} index={index}/>
                            ))}
                        </div>
                    )}
                </Droppable> */
      }
    </DragDropContext>);
  }
}

// Put the things into the DOM!
export default Home
