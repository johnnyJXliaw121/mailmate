import React, {Component} from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CardContent from "@material-ui/core/CardContent";
import Card from '@material-ui/core/Card';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Box from "@material-ui/core/Box";
import { shadows } from '@material-ui/system';
import { withStyles } from '@material-ui/core/styles';
import {CardHeader} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";




const grid = 15;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 0,
    margin: `0 0 ${grid}px 0`,
    ...draggableStyle
});

const CustomCardContentStyle = {
    root: {
        padding: '10px'
    }
};
class CustomCardContent extends Component{
    render(){
        return(
            <CardContent classes={{root: this.props.classes.root}}/>
        )
    }
}
CustomCardContent = withStyles(CustomCardContentStyle)(CustomCardContent);

class MiniCard extends Component {
    handleClick () {
        console.log("YEE MOTHER")
    }
    render () {
        const index = this.props.index
        const item = this.props.item
        const sender = this.props.sender
        const subject = this.props.subject
        const snippet = this.props.snippet
        console.log("sender", sender)
        // const letter = this.props.sender.substring(0, 1);
        // console.log(item)


        const letter = sender ? sender.charAt(0) : 'X'
        return (
            <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                        )}>
                        <Card style={{backgroundColor: '#white',
                                        borderLeft: '5px solid #74B5FF'}}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe">
                                        {letter}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        <DeleteIcon/>
                                    </IconButton>
                                }
                                title={sender}
                                subheader="September 14, 2016"
                            />
                            <CardContent onClick={this.handleClick}>
                                <Typography >
                                    <Box style={{
                                        marginTop: '-10px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        paddingBottom: '5px'}}>
                                        {subject}
                                    </Box>
                                </Typography>
                                    <Typography style={{marginBottom: '-10px'}}>
                                        <Box style={{fontFamily: 'Montserrat',
                                            fontSize: '14px',
                                            color: 'black',
                                            fontWeight: '50',
                                            paddingTop: '8px',
                                            opacity: '0.5'}}>{snippet}</Box>
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </Draggable>
        )
    }
}

export default MiniCard