import axios from 'axios';
//import from global action types
import {REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT} from './types';
//import the alerts
import {setAlert} from './alert';
//import global token from utils/helper functions
import setAuthToken from '../utils/setAuthToken';

//Load User
export const loadUser = () => async dispatch => {
    //check localStorage for token
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        //if successful load user
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
} 

//Register user
export const register = ({name, email, password}) => async dispatch => {
    const config ={
        headers: {
            'Content-type': 'application/json'
        }
    }

    const body = JSON.stringify({name, email, password});

    try {
        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser());
    } 
    catch (err) {
        const errors = err.response.data.errors;
        
        //If errors, loop through the errors array and display the msg using 'danger' class
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }
}

//Register user
export const login = ( email, password) => async dispatch => {
    const config ={
        headers: {
            'Content-type': 'application/json'
        }
    }

    const body = JSON.stringify({email, password});

    try {
        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser());
    } 
    catch (err) {
        const errors = err.response.data.errors;
        
        //If errors, loop through the errors array and display the msg using 'danger' class
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: LOGIN_FAIL
        })
    }
};

//LOGOUT / Clear profile
export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    })
}