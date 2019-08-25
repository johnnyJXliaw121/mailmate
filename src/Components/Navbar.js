import CreateIcon from '@material-ui/icons/Create';
import Box from '@material-ui/core/Box';



import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor:'red'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.15),
        '&:hover': {
            backgroundColor: fade('#2D21C2', 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'primary',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },
}));

export default function SearchAppBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar style={{backgroundColor:'white', borderTop: '4px solid #74B5FF'}}>
                    <Box>
                        <MailOutlineIcon color={"primary"}/>
                    </Box>
                    <Box  variant="h4" color="text.primary" className={classes.title} fontWeight="900" fontFamily="Montserrat" fontSize="20px">
                        MailMate
                    </Box>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon color={"primary"} />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <IconButton className = {classes.ComposeButton} color="primary"><CreateIcon/></IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}