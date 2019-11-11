import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Alert = ({alerts}) =>
//if there is an alert, loop through alert array and get each alert method by its unique id(UUID) 
alerts !== null && alerts.length > 0 && alerts.map(alert => (
    //Set the alert class to alertType declared in the actions(alert)
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
    </div>
));

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

//get the alert state. Fetch the array from react state to this component
const mapStateToProps = state => ({
    //From the rootreducer alert state
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert);
