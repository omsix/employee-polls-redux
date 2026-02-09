import React, { useState } from 'react';
import styles from "./login-page.module.css";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAuthedUser } from '../../utils/login/authedUser';
import { User } from '../../state-tree/model';
export interface LoginPageComponentProps { }
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { getQuestions } from './loginAPI';
import { receiveQuestions } from '../../utils/questions/questions';
import { useNavigate, useLocation } from 'react-router-dom';

export const LoginPageComponent: React.FunctionComponent<LoginPageComponentProps> = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const users: { [key: string]: User } = useAppSelector((state) => state.users.entities);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { path?: string };

  const handleLogin = () => {
    if (selectedUser) {
      const loadAUthedUserAndQuestions = async () => {
        const questions = await getQuestions(); // fetch from API or static file
        dispatch(receiveQuestions(questions));
        //Set the session to expire in 1 minute for the code review by Udacity
        await dispatch(setAuthedUser({ name: selectedUser, durationMinutes: 1 }));
        // Redirect to original path or dashboard
        navigate(state?.path || "/");
      };
      loadAUthedUserAndQuestions();
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