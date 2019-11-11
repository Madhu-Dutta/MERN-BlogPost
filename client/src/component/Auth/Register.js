 import React from 'react';
 import {Link, Redirect} from 'react-router-dom';
 import {Fragment, useState} from 'react';
 import PropTypes from 'prop-types';
 //Connect component to redux using {connect}
 import {connect} from 'react-redux';

 //import the alerts from reducers
 import {setAlert} from '../../actions/alert';
 import {register} from '../../actions/auth';

 const Register = ({setAlert, register, isAuthenticated}) => {
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
     const onChange = (e) => setFormData({
         //Don't grab the name , but the name value as a whole, so that it can be used for all the input fields
         //...formData is a spread Operator that stores the previous state, before calling the setFormData()
         ...formData, [e.target.name]: e.target.value
     })
    //  console.log(formData);

     const onSubmit = async (e) => {
        e.preventDefault();
        if(password !== password2){
            //'danger' = alertType
            setAlert('Password don\'t match', 'danger');
        }
        else{
            // console.log('Successful Registration');
            register({name, email, password});
        }
     }

     //Redirect to dashboard
     if(isAuthenticated){
        return(<Redirect to="/dashboard" />)
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
                        // required
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
                        // required
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
                        // minLength="6"
                        // required
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
                        // minLength="6" 
                        // required
                    />
                </div>
                <input 
                    type="submit" 
                    className="btn btn-primary"
                    value="register"
                />
             </form>
             <p className="my-1">
                 Do you already have an account? <Link to='/login'>Sign In</Link>
             </p>
         </Fragment>
     )
 }

 Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
 }

 const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

//export register,connect(anyStatewanttomap, {action})
export default connect(mapStateToProps, {setAlert,  register})(Register);
 