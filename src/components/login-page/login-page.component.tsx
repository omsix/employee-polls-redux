import React, { useState } from 'react';
import styles from "./login-page.module.css";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAuthedUser } from '../../utils/login-page/authedUser';
export interface LoginPageComponentProps { }
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

export const LoginPageComponent: React.FunctionComponent<LoginPageComponentProps> = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const users = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    if (selectedUser) { 
      dispatch(setAuthedUser({ name: selectedUser, durationMinutes: 60 }));
    }
  };

  return (
    <div className={styles["login-page-component"]}>
      <h2>Welcome to Employee Polls</h2>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">User</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          label="User"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Object.values(users).map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleLogin} disabled={!selectedUser} variant="contained">
        Login
      </Button>
    </div>
  );
};