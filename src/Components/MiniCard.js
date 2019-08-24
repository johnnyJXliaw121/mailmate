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
        // console.log(item)
        return (
            <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}>
                {(provided, snapshot) => (
                    <div
                        onClick={this.handleClick}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                        )}>
                        <Card style={{backgroundColor: '#white',
                                        borderLeft: '5px solid #74B5FF'}}>
                            <CardContent>
                                <Typography style={{marginTop: '-5px'}}>
                                    <span style={{color: '#74b5ff',
                                                    fontFamily: 'Montserrat, sans-serif',
                                                    fontSize: '20px',
                                                    fontWeight: '600'}}>{sender}</span>
                                </Typography>
                                <Typography >
                                    <Box style={{
                                        fontFamily: 'Montserrat, sans-serif',
                                        paddingBottom: '5px'}}>{subject}</Box>
                                </Typography>
                                    <Typography style={{marginBottom: '-10px'}}>
                                        <Box style={{fontFamily: 'Montserrat',
                                            fontSize: '12px',
                                            color: 'black',
                                            fontWeight: '50',
                                            paddingTop: '8px',
                                            opacity: '0.5',
                                            borderTop: '1px solid #ccc'}}>{snippet}</Box>
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