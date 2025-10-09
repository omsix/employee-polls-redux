import { UsersState } from "../../utils/login-page/users";

// A mock function to mimic making an async request for data
export const fetchAuthedUser = (name: string | null = null, durationMinutes: number = 5): Promise<{ data: { name: string | null, expiresAt: number | null } }> =>
  new Promise<{ data: { name: string | null, expiresAt: number | null } }>(resolve =>
    setTimeout(() => {
      localStorage.setItem('authedUser', JSON.stringify(name));
      resolve({ data: { name, expiresAt: Date.now() + durationMinutes * 60 * 1000 } })
    }, 500),
  )

export const fetchUsers = async (): Promise<UsersState> => {
  const response = await fetch('/users.json');
  console.log("response from fetch users", response);
  return await response.json();
};