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
import { Input } from 'react-nice-inputs';

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
      value: initialValue,
      textValue:'',
    }
    this.handleChange = this.handleChange.bind(this);

  }

  onOpenModal = (titleReceived,bodyReceived) => {
    this.setState({
        open: true, 
        title: titleReceived,
        body: bodyReceived
    });
  };

  onCloseModal = () => {
    this.setState({open: false});
  };

  onChange = ({value}) => {
    this.setState({value})
  }

  handleChange(event) {
      console.log(event.target.value);
    this.setState({textValue: event.target.value});
  }

  onSendEmail = (from,to,subject,message) => {
    sendEmail(from, to, subject, message).then((resp) => console.log("email sent"))
    this.setState({open: false});

}

  render() {
    const index = this.props.index
    const id = this.props.id
    const sender = this.props.sender
    const subject = this.props.subject
    const snippet = this.props.snippet
    const body = this.props.body
    const emailNameToSend = this.props.emailName
    return (<div>
      <Draggable key={id} draggableId={id} index={index}>
        {
          (provided, snapshot) => (<div onClick={() => this.onOpenModal(subject,body)} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
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
            maxWidth: '50em',
            height: '30em',
            overflow:'hidden',
            overflowY:'auto'
          }}>
          <h1 style={{textAlign:'center',fontSize:'40px'}}>{this.state.title}</h1>
          <h2 >Message From {sender}</h2>
          <p>{this.state.body}</p>
          <h2>Send your Email Below</h2>
          <div style={{display:'flex'}}>
          <h3 style={{marginRight:'2%'}}> Subject </h3>
                    

          <input style={{height:'3em',marginTop:'2px'}} value={this.state.textValue} onChange={this.handleChange}></input>
          </div>
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
              marginTop: '2em'
            }} onClick={()=>this.onSendEmail('MailMate <mail.mate@gmail.com',emailNameToSend,this.state.textValue,this.state.textBox)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </div>
        </form>
      </Modal>
    </div>)
  }
}

export default MiniCard