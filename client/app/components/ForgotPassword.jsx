import React from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import PropTypes from 'prop-types';


class ForgotPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            user:{},
            sent: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let {user} = this.state;
        axios
            .post('/api/v1/forgot', {
                email: user.email
            })
            .then((response) => {
                this.setState({
                    message: response.data.info,
                    sent: true
                });
            })
            .catch((errors) => {
                if(errors.response) {
                    this.setState({
                        errors: errors.response
                    });
                }
            });
    }

    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        if(user[field].length < 0 ) {
            this.setState({
                errors: {
                    statusMessage: 'Please fill in the blank fields below'
                }
            })
        }

        this.setState({
            user
        });
    }

    render() {
        const {message} = this.state;
        const formOrMessage = () => {
            if(this.state.sent) {
                return (
                    <div className="form-registration-group">
                        <p>{message}</p>
                    </div>
                )
            } else {
                return (
                    <form className="form-registration-group" onSubmit={this.handleSubmit} action="/" data-abide="">

                        <label htmlFor="email">E-mail:</label>
                        <input className="form-registration-input" type="text" id="email" name="email" onChange={this.changeUser} />

                        <button type="submit" id="loginButton" className="button form-registration-submit-button">Log In</button>

                        <p>Don't have an account? <Link to={'/signup'}>Create one</Link>.</p>
                    </form>
                )
            }
        };
        return (
            <div className="row">
                <div className="column small-centered medium-4 large-5">
                <div className="form-registration">
                    <figure className="form-registration-img">
                        <img src="https://images.pexels.com/photos/221205/pexels-photo-221205.jpeg?h=350&auto=compress&cs=tinysrgb" alt="" />
                        <figcaption className="form-registration-img-caption form-title">Login</figcaption>
                    </figure>
                        {formOrMessage()}
                </div>
            </div>
            </div>
        )
    }
}

ForgotPassword.contextTypes = {
    router: PropTypes.object.isRequired
};

export default ForgotPassword;