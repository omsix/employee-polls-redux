import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../utils/login-page/authedUser';

export interface NavBarComponentProps { }

export const NavBarComponent: React.FunctionComponent<NavBarComponentProps> = () => {
  const dispatch = useAppDispatch();
  return <button onClick={() => dispatch(logout())}>Log Out</button>;
};