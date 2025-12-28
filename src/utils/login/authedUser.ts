import { createAppSlice } from '../../app/createAppSlice';
import { fetchAuthedUser } from '../../components/login-page/loginAPI';
import { AuthedUserState } from '../../state-tree/state-tree';

const localUser: string = localStorage.getItem('authedUser') as string;

const initialState: AuthedUserState = {
    name: localUser ?? '',
    expiresAt: null,
    status: "idle"
};

export const authedUserSlice = createAppSlice({
    name: 'authedUser',
    initialState,
    reducers: create => ({
        logout: create.reducer(state => {
            state.name = null;
            state.expiresAt = null;
            state.status = "idle";
            localStorage.removeItem('authedUser');
        }),
        setAuthedUser: create.asyncThunk(
            async ({ name, durationMinutes }: { name: string | null, durationMinutes: number }) => {
                const response = await fetchAuthedUser(name, durationMinutes);
                return response.data;
            },
            {
                pending: state => {
                    state.status = "loading"
                },
                fulfilled: (state, action) => {
                    state.status = "idle"
                    state.name = action.payload.name;
                    state.expiresAt = action.payload.expiresAt;
                },
                rejected: state => {
                    state.status = "failed"
                },
            },
        ),
    }),
    selectors: {
        selectAuthedUser: authedUser => authedUser.name,
        selectAuthedUserStatus: authedUser => authedUser.status,
    },
});

export const { setAuthedUser, logout } = authedUserSlice.actions;
export const { selectAuthedUser, selectAuthedUserStatus } = authedUserSlice.selectors;
export default authedUserSlice.reducer;
