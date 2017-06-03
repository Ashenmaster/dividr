import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import LoginForm from './LoginForm.jsx';
import { Link } from 'react-router';

import axios from 'axios';

class LoginPage extends React.Component {

    /**
     * Class constructor.
     */
    constructor(props, context) {
        super(props, context);

        const storedMessage = localStorage.getItem('successMessage');
        let successMessage = '';

        if (storedMessage) {
            successMessage = storedMessage;
            localStorage.removeItem('successMessage');
        }

        // set the initial component state
        this.state = {
            errors: {},
            successMessage,
            user: {
                email: '',
                password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    componentWillMount() {
        document.title = "Dividr | Login"
    }

    /**
     * Process the form.
     *
     * @param {object} event - the JavaScript event object
     */
    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();

        // create a string for an HTTP body message
        const email = this.state.user.email;
        const password = encodeURIComponent(this.state.user.password);

        axios
            .post('/api/v1/login',
                {
                    email,
                    password
                })
            .then((response) => {
                Auth.authenticateUser(response.data.token);
                this.context.router.replace('/meallist');
            })
            .catch((errors) => {
                if(errors.response) {
                    this.setState({
                        errors: errors.response
                    });
                }
            });
    }

    /**
     * Change the user object.
     *
     * @param {object} event - the JavaScript event object
     */
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

    /**
     * Render the component.
     */
    render() {
    const errorMessage = () => {
        if(this.state.errors.status === 400) {
            return {
                statusMessage: 'Something went wrong, please check your inputs below'
            }
        } else if(this.state.errors.status === 401) {
            return {
                statusMessage: "Incorrect login details, please try again."
            }
        } else {
            return null
        }
    };
        return (
            <div className="row">
                <div className="column small-centered medium-4 large-5">
                    <LoginForm
                        onSubmit={this.processForm}
                        onChange={this.changeUser}
                        errors={errorMessage()}
                        successMessage={this.state.successMessage}
                        user={this.state.user}
                    />
                    <Link to="/forgotpassword">
                        Forgot Password
                    </Link>
                </div>
            </div>
        );
    }

}

LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default LoginPage;