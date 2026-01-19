import styles from "./menu-toolbar.module.css";
import React from "react";
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from '../../utils/login/authedUser';
import { useAppSelector } from '../../app/hooks';
import { Avatar } from "@mui/material";
import CircularText from "../circular-text/circular-text.component";

export interface MenuToolbarComponentProps { }

const MenuToolbarComponent: React.FunctionComponent<MenuToolbarComponentProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const userId = useAppSelector((state) => state.authedUser.name);
  const users = useAppSelector((state) => state.users.entities);
  const user = users[userId || ''] || {};
  const avatarSrc = user.avatarURL;
  const fullName = user.name || '';

  const currentPageLabel = React.useMemo(() => {
    const pathname = location.pathname;
    if (pathname === "/" || pathname === "/login") return "Dashboard";
    if (pathname === "/add") return "New Poll";
    if (pathname === "/leaderboard" || pathname === "/leader-board") return "Leader Board";
    return "";
  }, [location.pathname]);

  const menuOpen = Boolean(menuAnchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear(); // optional: clear persisted state
    navigate('/login');   // redirect to login page
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Employee Polls{currentPageLabel ? ` - ${currentPageLabel}` : ""}
        </Typography>
        <div className={styles["menu-toolbar-component"]}>
          <CircularText
            text={fullName}
            radius={40}
            fontSize={12}
            color="var(--AppBar-color)"
          >
            <Avatar alt={fullName} src={avatarSrc || undefined}></Avatar>
          </CircularText>
          <IconButton
            color="inherit"
            size="large"
            onClick={handleOpenMenu}
            aria-controls={menuOpen ? "main-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="main-menu"
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                handleNavigate("/");
              }}
            >
              Home
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                handleNavigate("/add");
              }}
            >
              New Poll
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                handleNavigate("/leaderboard");
              }}
            >
              Leaderboard
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                handleLogout();
              }}
            >
              <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
export default MenuToolbarComponent;
