//Root Reducer 
//Use {combinereducer} to combine different reducers in a single root file
import {combineReducers} from 'redux';
import alert from './alert';

export default combineReducers({
    alert
});