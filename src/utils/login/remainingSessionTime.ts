import { createAppSlice } from '../../app/createAppSlice';

/**
 * State interface for tracking remaining session time
 */
export interface RemainingSessionTimeState {
  seconds: number | null;
}

const initialState: RemainingSessionTimeState = {
  seconds: null,
};

/**
 * Redux slice for managing the remaining session time countdown.
 * Tracks the number of seconds until the authenticated user's session expires.
 * Updates every second via a timer mechanism in the UI component.
 */
export const remainingSessionTimeSlice = createAppSlice({
  name: 'remainingSessionTime',
  initialState,
  reducers: create => ({
    /**
     * Updates the remaining session time in seconds.
     * Called periodically (every second) to update the countdown.
     */
    updateRemainingTime: create.reducer((state, action: { payload: number | null }) => {
      state.seconds = action.payload;
    }),
    /**
     * Resets the remaining session time to null (no active session).
     */
    resetRemainingTime: create.reducer(state => {
      state.seconds = null;
    }),
  }),
  selectors: {
    selectRemainingSeconds: state => state.seconds,
  },
});

export const { updateRemainingTime, resetRemainingTime } = remainingSessionTimeSlice.actions;
export const { selectRemainingSeconds } = remainingSessionTimeSlice.selectors;
export default remainingSessionTimeSlice.reducer;
