import "./App.css"
import { useAppSelector, useAppDispatch } from "./app/hooks"
import MainRoutes from "./app/main-routes"
import { LoginPageComponent } from "./components/login-page/login-page.component"
import { useEffect } from "react"
import { logout } from "./utils/login-page/authedUser"
import { receiveUsers } from "./utils/login-page/users"
import { getUsers } from "./components/login-page/loginAPI"
import MenuToolbarComponent from "./components/menu-toolbar/menu-toolbar.component"

const App: React.FC = () => {
  const { name, expiresAt } = useAppSelector((state) => state.authedUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getUsers(); // fetch from API or static file
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
    <div className="App">
      {name ? <div><MenuToolbarComponent /><MainRoutes /></div> : <LoginPageComponent />}
    </div>
  </>;
}

export default App;