import uuid from 'uuid';
import {SET_ALERT, REMOVE_ALERT} from './types';


//SET_ALERT 
//Dispatch is coming from the thunk middleware
export const setAlert = (msg, alertType, timeout = 3000) => dispatch => {
    //Generate a generic universal Id from an package call UUID
    const id = uuid.v4();
    //This action events will trigger the state changes in the reducers
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    })

    //Remove alert after 3secs time
    setTimeout(() => 
    dispatch({
        type: REMOVE_ALERT, 
        payload: id
    }), timeout);
};


