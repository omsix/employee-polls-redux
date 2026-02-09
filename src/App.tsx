import "./App.css"
import { useAppDispatch } from "./app/hooks"
import { Routes, Route, Navigate } from "react-router-dom"
import { LoginPageComponent } from "./components/login-page/login-page.component"
import { DashboardComponent } from "./components/dashboard/dashboard.component"
import { PollDetailsPageComponent } from "./components/poll-details/poll-details-page.component"
import { NewPollComponent } from "./components/new-poll/new-poll.component"
import { LeaderBoardComponent } from "./components/leader-board/leader-board.component"
import { NotFoundComponent } from "./components/not-found/not-found.component"
import { RequireAuth } from "./components/require-auth/require-auth.component"
import MenuToolbarComponent from "./components/menu-toolbar/menu-toolbar.component"
import { useEffect } from "react"
import { receiveUsers } from "./utils/login/users"
import { getUsers } from "./components/login-page/loginAPI"

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getUsers();
      dispatch(receiveUsers(users.entities));
    };
    loadUsers();
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPageComponent />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MenuToolbarComponent />
              <DashboardComponent />
            </RequireAuth>
          }
        />
        <Route
          path="/questions/:id"
          element={
            <RequireAuth>
              <MenuToolbarComponent />
              <PollDetailsPageComponent />
            </RequireAuth>
          }
        />
        <Route
          path="/add"
          element={
            <RequireAuth>
              <MenuToolbarComponent />
              <NewPollComponent />
            </RequireAuth>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <RequireAuth>
              <MenuToolbarComponent />
              <LeaderBoardComponent />
            </RequireAuth>
          }
        />
        <Route path="/404" element={<><MenuToolbarComponent />
          <NotFoundComponent /></>} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </div>
  );
}

export default App;