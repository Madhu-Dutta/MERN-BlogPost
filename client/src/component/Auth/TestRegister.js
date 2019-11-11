import React from 'react';
import {Fragment, useState} from 'react';
//Test the register endpoints
import axios from 'axios'; 

const Register = () => {
    //formData = state, setFormData = setState()
       //useSate has default/initial state = {}
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    //Pull out fields from formData
    const {name, email, password, password2} = formData;

    //onChange handler function
    const onChange = e => setFormData({
        //Don't grab the name , but the name value as a whole, so that it can be used for all the input fields
        //...formData is a spread Operator that stores the previous state, before calling the setFormData()
        ...formData, [e.target.name]: e.target.value
    })
   //  console.log(formData);

    const onSubmit = async e => {
       e.preventDefault();
       if(password !== password2){
           console.log('password don\'t match');
       }
       else{
           const newUser =  {
               name,
               email,
               password
           }
           try{
               const config = {
                   headers: {
                       'Content-type': 'application/json'
                   }
               }
               //Parse the body as a json object
               const body = JSON.stringify(newUser);

               //register endpoint is set to '/api/users' as proxy used has 'localhost://5000'
               const res = await axios.post('/api/users', body, config);
               //res.data is the token
               console.log(res.data);
           }
           catch(err){
               console.error(err.response.data);
           }
       }
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead">
                <i className="fas fa-user">
                    Create your own account
                </i>
            </p>
            <form className="form" onSubmit={e => onSubmit(e)}>
               <div className="form-group">
                   <input 
                       type="text" 
                       placeholder="Name"
                       name="name"
                       //Set value = name, for using it in onchange handler
                       value={name}
                       //Onchange handler
                       onChange={(e) => onChange(e)}
                       required
                   />
               </div>
               
               <div className="form-group">
                   <input 
                       type="email" 
                       placeholder="Email address"
                       name="email"
                       //Set value = name, for using it in onchange handler
                       value={email}
                       //Onchange handler
                       onChange={(e) => onChange(e)}
                       required
                   />
                   <small className="form-text">
                       This site uses Gravatar, so if you want to use a profile image use a Gravatar email
                   </small>
               </div>
               <div className="form-group">
                   <input 
                       type="password" 
                       placeholder="Password"
                       name="password"
                       //Set value = name, for using it in onchange handler
                       value={password}
                       //Onchange handler
                       onChange={(e) => onChange(e)}
                       minLength="6"
                       required
                   />
               </div>
               <div className="form-group">
                   <input 
                       type="password" 
                       placeholder="Confirm password"
                       name="password2"
                       //Set value = name, for using it in onchange handler
                       value={password2}
                       //Onchange handler
                       onChange={(e) => onChange(e)}
                       minLength="6"
                       required
                   />
               </div>
               <input 
                   type="submit" 
                   className="btn btn-primary"
                   value="register"
               />
            </form>
            <p className="my-1">
                Do you already have an account? < a href = 'login.html'>Sign In</a>
            </p>
        </Fragment>
    )
}
export default Register;
