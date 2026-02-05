import "./App.css"
import { useAppSelector, useAppDispatch } from "./app/hooks"
import MainRoutes from "./app/main-routes"
import { LoginPageComponent } from "./components/login-page/login-page.component"
import { useEffect } from "react"
import { logout } from "./utils/login/authedUser"
import { receiveUsers } from "./utils/login/users"
import { getUsers } from "./components/login-page/loginAPI"
import MenuToolbarComponent from "./components/menu-toolbar/menu-toolbar.component"

const App: React.FC = () => {
  const { name, expiresAt } = useAppSelector((state) => state.authedUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getUsers(); // fetch from API or static file
      dispatch(receiveUsers(users.entities));
    };
    loadUsers();
  }, [dispatch])

  useEffect(() => {
    // Check session expiry immediately and periodically
    const checkExpiry = () => {
      if (expiresAt && Date.now() > expiresAt) {
        dispatch(logout());
      }
    };
    
    checkExpiry();
    const intervalId = setInterval(checkExpiry, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [expiresAt, dispatch]);

  return <>
    <div className="App">
      {name ? <div><MenuToolbarComponent /><MainRoutes /></div> : <LoginPageComponent />}
    </div>
  </>;
}

export default App;