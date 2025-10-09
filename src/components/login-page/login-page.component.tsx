import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAuthedUser } from '../../utils/login-page/authedUser';
export interface LoginPageComponentProps { }


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
    <div className="login-container">
      <h2>Welcome to Employee Polls</h2>
      <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
        <option value="">Select a user</option>
        {Object.values(users).map((user) => (
          <option key={user.id} value={user.name}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={handleLogin} disabled={!selectedUser}>
        Login
      </button>
    </div>
  );
};