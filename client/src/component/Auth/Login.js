import React,{Fragment, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';

//redux
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
//import from actions
import {login} from '../../actions/auth';


const Login = ({login, isAuthenticated}) => {

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
        // console.log('success');
        login(email, password);
    }

    //Redirect to profile page if logged in
    if(isAuthenticated){
        return (<Redirect to="/dashboard" />)
    }

    return (
        <Fragment>
        <h1 className="large text-primary">Log In</h1>
        <p className="lead">
            <i className="fas fa-user">
                Sign in to your account
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

login.PropTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login);