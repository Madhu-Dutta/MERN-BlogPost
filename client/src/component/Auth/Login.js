import React,{Fragment, useState} from 'react';
import {Link} from 'react-router-dom';

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    //Pull out fields from formData
    const {email, password} = formData;

    //onChange handler function
    const onChange = e => setFormData({
        //Don't grab the name , but the name value as a whole, so that it can be used for all the input fields
        //...formData is a spread Operator that stores the previous state, before calling the setFormData()
        ...formData, [e.target.name]: e.target.value
    })
    //  console.log(formData);

    const onSubmit = async e => {
        e.preventDefault();        
        console.log('success');
    }

    return (
        <Fragment>
        <h1 className="large text-primary">Log In</h1>
        <p className="lead">
            <i className="fas fa-user">
                Create your own account
            </i>
        </p>
        <form className="form" onSubmit={e => onSubmit(e)}>
           
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
          
           <input 
               type="submit" 
               className="btn btn-primary"
               value="login"
           />
        </form>
        <p className="my-1">
            Do you already have an account? <Link to='/register'>Register</Link>
        </p>
    </Fragment>
    )
}

export default Login;