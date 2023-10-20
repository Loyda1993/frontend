import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Tooltip, Divider, Avatar, IconButton, Stack, BottomNavigation, BottomNavigationAction } from "@mui/material";
import {MenuItem, Menu} from '@mui/material';

import { Link, useNavigate } from "react-router-dom";
import FaceIcon from '@mui/icons-material/Face';
import {AuthContext } from '../context/authContext'
import { useContext } from "react";

import ResponsiveDrawer from './drawer';

function NavBar() {
    let navigate = useNavigate();
    const { user, logout} = useContext(AuthContext);

    const onLogout = () => {
        logout();
        navigate('/');
    }

    /******* */
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>

                    { 
                    user ? 
                    <>
                    
                    <Box sx={{display: 'flex', alignItems:'center', textAlign:'center'}}>
                        <Typography sx={{minWidth: 100}} variant="h5" component="div">
                            <Link to="/" style={{textDecoration: "none", color:"white"}}>Y-APP </Link>
                        </Typography>
                        <Typography sx={{minWidth: 100}} variant="button" component="div">
                            <Link to="/Diary" style={{textDecoration: "none", color:"white"}}>Registro </Link>
                        </Typography>
                    </Box>
                    <Box alignItems="right" sx={{ display:'flex', flexGrow: 1, textAlign: "Left", marginLeft: "10px"}}>   
                        <Button
                            style={{textDecoration: "none", color:"white"}}
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            >
                            Menu
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        >
                            <MenuItem onClick={handleClose}><Link to="/Product" style={{textDecoration: "none"}}> Productos </Link></MenuItem>
                            <MenuItem onClick={handleClose}><Link to="/TypeProduct" style={{textDecoration: "none"}}> Tipo de Productos </Link></MenuItem>
                            <MenuItem onClick={handleClose}><Link to="/PointSale" style={{textDecoration: "none"}}> Punto de Venta </Link></MenuItem>
                            <MenuItem onClick={handleClose}><Link to="/User" style={{textDecoration: "none"}}> Usuarios </Link></MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}><Link to="/Report" style={{textDecoration: "none"}}> Reportes </Link></MenuItem>
                        </Menu>
                    </Box>
                    </>
                    :<><div></div></>
                    }
                    <Box alignItems="right" sx={{flexGrow: 1, textAlign: "right"}}>
                        {user ? 
                        <>
                        <Button style={{textDecoration: "none", color:"white"}} onClick={onLogout}>Salir</Button>
                        </>
                        :
                        <>
                        <Link to="/login" style={{textDecoration: "none", color:"white", marginRight: "10px"}}> 
                            <Tooltip title="Inicio de sesión">
                                <FaceIcon fontSize="large" /> 
                            </Tooltip>
                        </Link>
                        </>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default NavBar;
