import "./App.css"
import { useAppSelector, useAppDispatch } from "./app/hooks"
import MainRoutes from "./app/main-routes"
import { LoginPageComponent } from "./components/login-page/login-page.component"
import { useEffect } from "react"
import { logout } from "./utils/login-page/authedUser"
import { receiveUsers } from "./utils/login-page/users"
import { fetchUsers } from "./components/login-page/loginAPI"

const App: React.FC = () => {
  const { name, expiresAt } = useAppSelector((state) => state.authedUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers(); // fetch from API or static file
      dispatch(receiveUsers(users));
    };
    loadUsers();
  }, [])

  useEffect(() => {
    if (expiresAt && Date.now() > expiresAt) {
      dispatch(logout());
    }
  }, [expiresAt, dispatch]);

  return <>
    <div className="App">{name ? <MainRoutes /> : <LoginPageComponent />}
    </div>
  </>;
}

export default App;