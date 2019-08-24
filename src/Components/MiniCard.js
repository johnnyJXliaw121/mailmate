import React, {Component} from "react";
import {Draggable} from 'react-beautiful-dnd';
import CardContent from "@material-ui/core/CardContent";
import Card from '@material-ui/core/Card';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Modal from 'react-responsive-modal';
import {Value} from 'slate';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {sendEmail} from "../api/Email";

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

const grid = 15;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 0,
  margin: `0 0 ${grid}px 0`,
  ...draggableStyle
});

class MiniCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: initialValue
    }
  }

  onOpenModal = (titleReceived) => {
    this.setState({open: true, title: titleReceived});
  };

  onCloseModal = () => {
    this.setState({open: false});
  };

  onChange = ({value}) => {
    this.setState({value})
  }

  render() {
    const index = this.props.index
    const id = this.props.id
    const sender = this.props.sender
    const subject = this.props.subject
    const snippet = this.props.snippet

    return (<div>
      <Draggable key={id} draggableId={id} index={index}>
        {
          (provided, snapshot) => (<div onClick={() => this.onOpenModal("item.id")} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
            <Card>
              <CardContent>
                <Typography>
                  <span style={{
                      color: 'black',
                      fontSize: '18px',
                      fontWeight: '600'
                    }}>{sender}</span>
                </Typography>
                <Typography >
                  <Box fontWeight="fontWeightLight">{subject}</Box>
                </Typography>
                <Typography style={{
                    marginBottom: '0px'
                  }}>
                  <Box style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: '15px',
                      color: '#b0b0b0',
                      fontWeight: '200'
                    }}>{snippet}</Box>
                </Typography>

              </CardContent>
            </Card>
          </div>)
        }
      </Draggable>
      <Modal open={this.state.open} onClose={this.onCloseModal} center="center">
        <form style={{
            width: '50em',
            height: '30em'
          }}>
          <h1>Title</h1>
          <p>{this.state.title}</p>
          <h1>Body</h1>

          <CKEditor editor={ClassicEditor} data={this.state.textBox} onInit={editor => {
              // You can store the "editor" and use when it is needed.
              console.log('Editor is ready to use!', editor);
            }} onChange={(event, editor) => {
              const data = editor.getData();
              console.log({event, editor, data});
              this.setState({textBox: data});

            }} onBlur={editor => {
              console.log('Blur.', editor);
            }} onFocus={editor => {
              console.log('Focus.', editor);
            }}/>
          <div style={{
              textAlign: 'center',
              marginTop: '10em'
            }} onClick={() => sendEmail("MailMate <mailmate.aus@gmail.com>", "MailMate <mailmate.aus@gmail.com>", "test", "hello test message").then((resp) => console.log("email sent"))}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </div>
        </form>
      </Modal>
    </div>)
  }
}

export default MiniCard