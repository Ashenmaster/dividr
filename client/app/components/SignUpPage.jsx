import React from 'react';
import PropTypes from 'prop-types'
import axios from 'axios'
import SignUpForm from 'Components/SignUpForm';


class SignUpPage extends React.Component {

    /**
     * Class constructor.
     */
    constructor(props, context) {
        super(props, context);

        // set the initial component state
        this.state = {
            errors: {},
            user: {
                email: '',
                firstName: '',
                lastName: '',
                password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
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
        const firstName = encodeURIComponent(this.state.user.firstName);
        const lastName = encodeURIComponent(this.state.user.lastName);
        const email = this.state.user.email;
        const password = encodeURIComponent(this.state.user.password);

        axios
            .post('/api/v1/register', {
                email,
                password,
                firstName,
                lastName
            })
            .then(() => {
                this.context.router.replace('/login');
            })
            .catch((errors) => {
                if(errors.response) {
                    this.setState({
                        errors: errors.response
                    });
                    console.log(this.state);
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

        this.setState({
            user
        });
    }

    componentWillMount() {
        document.title = "Dividr | Sign Up"
    }

    /**
     * Render the component.
     */
    render() {
        const errorMessage = () => {
            if(this.state.errors.status === 422) {
                return {
                    errors: {
                        statusMessage: this.state.errors.data.error
                    }
                }
            } else {
                return {
                    errors: {}
                }
            }
        };
        return (
            <div className="row">
                <div className="column small-centered medium-4 large-5">
                    <SignUpForm
                        onSubmit={this.processForm}
                        onChange={this.changeUser}
                        errors={errorMessage()}
                        user={this.state.user}
                    />
                </div>
            </div>
        );
    }

}

SignUpPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default SignUpPage;