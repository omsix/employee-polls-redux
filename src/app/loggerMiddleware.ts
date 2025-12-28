import { Middleware } from '@reduxjs/toolkit';

const loggerMiddleware: Middleware = (store) => (next) => (action: any) => {
    console.group(action.type);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    const result = next(action); // Pass action to reducer
    console.log('Next State:', store.getState());
    console.groupEnd();
    return result;
};

export default loggerMiddleware;
