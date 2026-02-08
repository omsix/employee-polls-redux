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
import { Avatar, Chip } from "@mui/material";
import CircularText from "../circular-text/circular-text.component";
import { updateRemainingTime, resetRemainingTime } from '../../utils/login/remainingSessionTime';

export interface MenuToolbarComponentProps { }

const MenuToolbarComponent: React.FunctionComponent<MenuToolbarComponentProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const userId = useAppSelector((state) => state.authedUser.name);
  const expiresAt = useAppSelector((state) => state.authedUser.expiresAt);
  const remainingSeconds = useAppSelector((state) => state.remainingSessionTime.seconds);
  const users = useAppSelector((state) => state.users.entities);
  const user = users[userId || ''] || {};
  const avatarSrc = user.avatarURL;
  const fullName = user.name || '';

  const handleLogout = React.useCallback(() => {
    dispatch(logout());
    dispatch(resetRemainingTime());
    localStorage.clear();
    navigate('/login');
  }, [dispatch, navigate]);

  // Update remaining session time every second
  React.useEffect(() => {
    if (!expiresAt) {
      dispatch(resetRemainingTime());
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      dispatch(updateRemainingTime(remaining));

      // Auto logout when session expires
      if (remaining <= 0) {
        handleLogout();
      }
    };

    // Initial update
    updateTimer();

    // Set up interval to update every second
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt, dispatch, handleLogout]);

  // Format remaining time as MM:SS
  const formatTime = (seconds: number | null): string => {
    if (seconds === null || seconds < 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Employee Polls{currentPageLabel ? ` - ${currentPageLabel}` : ""}
        </Typography>
        {remainingSeconds !== null && (
          <Chip
            label={`Session: ${formatTime(remainingSeconds)}`}
            color={remainingSeconds < 30 ? "error" : "default"}
            size="small"
            sx={{ marginRight: 2 }}
          />
        )}
        <div className={styles["menu-toolbar-component"]}>
          <CircularText
            text={fullName}
            radius={40}
            fontSize={12}
            color="var(--AppBar-color)"
            onClick={handleOpenMenu}
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
