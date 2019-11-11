//Import the type of alerts from the actions folder
import {SET_ALERT, REMOVE_ALERT} from '../actions/types';

//show alerts
//Inital state can be id:1, 
const initialState = [];

//action has 2 parameters - type(needs to evaluated) and payload(data)
export default function(state=initialState, action){
    //pull out payload and type from action
    const {type, payload} = action;

    switch(type) {
        case SET_ALERT:
            // Adding alert. Include all the other states, as state is mutable,
                //other states can be overriden by the payload data, while adding the alert
            return [...state, payload];
        case REMOVE_ALERT:
            //Remove the data that matches the alert id
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}