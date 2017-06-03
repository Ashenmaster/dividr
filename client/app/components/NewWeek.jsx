import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';

class LogoutPage extends React.Component {
    componentWillMount() {
        if(Auth.isUserAuthenticated()) {
            axios.delete('/api/v1/meals', {
                headers: {
                    "Authorization" : `${Auth.getToken()}`
                }
            })
                .then((response) => {
                    //console.log(response);
                }).catch((errors) => {
                    console.log(errors);
                });
        } else {
            this.context.router.replace('/login');
        }
    }

    componentDidMount() {
        this.context.router.replace('/meallist');
    }

    render() {
        return null
    }
}

LogoutPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default LogoutPage;