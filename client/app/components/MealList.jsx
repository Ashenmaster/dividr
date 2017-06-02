import React from 'react'
import axios from 'axios';
import {hashHistory} from 'react-router'
import PropTypes from 'prop-types'

import Meal from 'Components/Meal';
import DeleteConfirm from 'Components/DeleteConfirm';
import CreateMealForm from 'Components/CreateMealForm';
import Auth from '../modules/Auth';


class MealList extends React.Component {
    constructor() {
        super();
        this.startDeleting = this.startDeleting.bind(this);
        this.startCreating = this.startCreating.bind(this);
        this.cancelCreate = this.cancelCreate.bind(this);
        this.changeMeal = this.changeMeal.bind(this);
        this.processForm = this.processForm.bind(this);
        this.state = {
            user: {
                creating: false,
                startDelete: false,
                profile: {},
            },
            meals: [],
            errors:{
            }
        }
    }

    componentDidMount() {
        let _this = this;
        this.serverRequest =
            axios
                .get('/api/v1/meals', {
                    headers: {
                        "Authorization" : `${Auth.getToken()}`
                    }
                })
                .then((result) => {
                    _this.setState({
                        user: result.data.user,
                        meals: result.data.user.meals
                    })
                })
    }

    componentWillMount() {
        if(!Auth.isUserAuthenticated()) {
            hashHistory.push('/login');
        }

        document.title = "Dividr | Meal List"
    }

    startDeleting = (event) => {
        event.preventDefault();
        this.setState({
            startDelete: true
        })
    };

    cancelDelete = (event) => {
        event.preventDefault();

        this.setState({
            startDelete: false
        })
    };

    startCreating = (event) => {
        event.preventDefault();
        this.setState({
            creating: true
        })
    };

    processForm(event) {
        event.preventDefault();
        let mealName = this.state.meals.mealName;
        let cookedWeight = this.state.meals.cookedWeight;
        let servings = this.state.meals.servings;
        axios
            // POSTs form value
            .post('/api/v1/meals', {
                mealName,
                cookedWeight,
                servings
            }, {
                headers: {
                    "Authorization" : `${Auth.getToken()}`
                }
            })
            .then((response) => {
                this.setState({
                    creating: false,
                    meals: this.state.meals.concat(response.data)
                });
                this.context.router.replace('/meallist');
            }).catch((e) => {
            if(e.response) {
                this.setState({
                    errors: e.response
                });
            }
            console.log(e);
        })
    }

    changeMeal(event) {
        const field = event.target.name;
        const meals = this.state.meals;
        meals[field] = event.target.value;
        this.setState({
            meals
        });
    }

    cancelCreate(event) {
        event.preventDefault();
        this.setState({
            creating: false
        })
    }

    render() {
        const errorMessage = () => {
            if (this.state.errors.data) {
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


        let {user, meals} = this.state;
        let renderDeleteOrCreate = () => {
            if(this.state.startDelete) {
                return (
                    <DeleteConfirm onClick={this.cancelDelete}/>
                )
            } else if(this.state.creating) {
                return (
                    <CreateMealForm onSubmit={this.processForm} errors={errorMessage()} onChange={this.changeMeal} onClick={this.cancelCreate} />
                )
            } else if(meals.length === 0) {
                return (
                    <CreateMealForm onSubmit={this.processForm} errors={errorMessage()} onChange={this.changeMeal} onClick={this.cancelCreate} mealLength={meals.length} />
                )
            }  else {
                return (

                    <div>
                        {meals.map((meal) => {
                            return (
                                <Meal key={meal._id} meal={meal} />
                            )
                        })}
                    </div>


                )
            }
        };
        return (
            <div className="row">
                <div className="column small-centered medium-4 large-6">
                    <div className="meal-list">
                        <h3 className="meallist-title text-center">Welcome back {user.profile.firstName}!</h3>
                {renderDeleteOrCreate()}
                    <div className="button-group-option" data-grouptype="OR">
                        <button onClick={this.startCreating} className="button success radius">New Meal</button>
                        <button onClick={this.startDeleting} className="button primary radius">New Week</button>
                    </div>
                    </div>
                </div>
            </div>

        );
    }
}

MealList.contextTypes = {
    router: PropTypes.object.isRequired
};

export default MealList;