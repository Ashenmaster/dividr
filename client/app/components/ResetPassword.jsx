import React from 'react';

import {Link} from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';



class ResetPassword extends React.Component {
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            user:{}
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let password = this.refs.password.value;
        let id = this.props.params.id;
        axios
            .post('/api/v1/reset/' + id, {
                password
            })
            .then((response) => {
                this.context.router.replace('/login');
            })
            .catch((errors) => {
                if(errors.response) {
                    this.setState({
                        errors: errors.response
                    });
                }
            });
    }

    render() {
        return (
            <div className="row">
                <div className="column small-centered medium-4 large-5">
                    <div className="form-registration">
                        <figure className="form-registration-img">
                            <img src="https://images.pexels.com/photos/221205/pexels-photo-221205.jpeg?h=350&auto=compress&cs=tinysrgb" alt="" />
                            <figcaption className="form-registration-img-caption form-title">Reset Password</figcaption>
                        </figure>
                        <form className="form-registration-group" onSubmit={this.handleSubmit} action="/" data-abide="">

                            <label htmlFor="email">Password:</label>
                            <input className="form-registration-input" ref="password" type="password" id="password" name="password" />

                            <button type="submit" id="loginButton" className="button form-registration-submit-button">Reset Password</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

ResetPassword.contextTypes = {
    router: PropTypes.object.isRequired
};

export default ResetPassword;