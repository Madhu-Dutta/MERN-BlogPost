//Just creating a global headers using axios
import axios from 'axios';

//When we have a token send it with every request instead of picking and choosing which request to send
const setAuthToken = token => {
    if(token){
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    else{
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;