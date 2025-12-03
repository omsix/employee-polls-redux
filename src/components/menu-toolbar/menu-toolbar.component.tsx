import styles from "./menu-toolbar.module.css";
import React from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../utils/login-page/authedUser';
import { useAppSelector } from '../../app/hooks';
import { Tooltip, Avatar } from "@mui/material";
import CircularText from "../circular-text/circular-text.component";

export interface MenuToolbarComponentProps { }

const MenuToolbarComponent: React.FunctionComponent<MenuToolbarComponentProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.authedUser.name);
  const users = useAppSelector((state) => state.users);
  const user = users[userId || ''] || {};
  const avatarSrc = user.avatarURL;
  const fullName = user.name || '';

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear(); // optional: clear persisted state
    navigate('/login');   // redirect to login page
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Employee Polls
        </Typography>
        <div className={styles["menu-toolbar-component"]}>

          <CircularText
            text={fullName}
            radius={40}
            fontSize={12}
            color="white"            
          >
            <Avatar alt={fullName} src={avatarSrc || undefined}></Avatar>
          </CircularText>

          <Tooltip title="Logout">
            <IconButton color="inherit" size="large" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default MenuToolbarComponent;
