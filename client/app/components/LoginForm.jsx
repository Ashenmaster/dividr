import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import FlashMessage from 'Components/FlashMessage';

class LoginForm extends React.Component {


    constructor(props) {
        super(props)
    }

    render() {
        let {successMessage, errors, onSubmit, onChange} = this.props;
           return(
               <div>
                   {successMessage && <FlashMessage message={successMessage} messageType="success"/>}
                   {errors && <FlashMessage message={errors.statusMessage} messageType="alert"/>}
                   <div className="form-registration">
                       <figure className="form-registration-img">
                           <img src="https://images.pexels.com/photos/221205/pexels-photo-221205.jpeg?h=350&auto=compress&cs=tinysrgb" alt="" />
                           <figcaption className="form-registration-img-caption form-title">Login</figcaption>
                       </figure>
                       <form className="form-registration-group" action="/" onSubmit={onSubmit} data-abide="">


                           <label htmlFor="email">E-mail:</label>
                           <input className="form-registration-input" type="text" id="email" name="email" onChange={onChange} />


                           <label htmlFor="password">Password:</label>
                           <input className="form-registration-input" type="password" id="password" name="password" onChange={onChange}/>

                           <button type="submit" id="loginButton" className="button form-registration-submit-button">Log In</button>

                           <p>Don't have an account? <Link to={'/signup'}>Create one</Link>.</p>
                           <Link to="/forgotpassword">
                               Forgot Password
                           </Link>
                       </form>
                   </div>
               </div>
           )
    }
}

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    successMessage: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
};

export default LoginForm;
