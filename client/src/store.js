//Typical Boilerplate store
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

//all the initial states of the reducers
const initialState = {};
//only middleware going to use is thunk - is used to make asychronous api calls
const middleware = [thunk];
//Create the global store
const store = createStore(
    rootReducer, 
    initialState, 
    // This is to check redux states and action in the browser console
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;