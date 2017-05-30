import React from 'react';
import axios from 'axios';

import Auth from './../modules/Auth';

class Meal extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            portionSize: this.props.meal.portionSize,
            editable: false,
            meal: this.props.meal
        }
    }

    handleClick() {
        if(this.state.editable) {
            this.setState({
                editable : false
            });
        } else {
            this.setState({
                editable : true
            });
        }

    };

    handleSubmit(event) {
        event.preventDefault();

        let id = this.props.meal._id;

        let mealName = this.refs.mealName.value;
        let cookedWeight = this.refs.cookedWeight.value;
        let servings = this.refs.servings.value;
        let baseUrl = '/api/v1/meals/' + id;

        axios
            .patch(baseUrl,
                {
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
                    editable: false,
                    meal: response.data.meal
                });
            })
            .catch((errors) => {
                console.log(errors);
            });
    }
    incrementValue = () => {
        let value = parseInt(document.getElementById('servings').value, 10);
        value = isNaN(value) ? 0 : value;
        value++;
        document.getElementById('servings').value = value;
    };

    decrementValue = () => {
        let value = parseInt(document.getElementById('servings').value, 10);
        value = isNaN(value) ? 0 : value;
        value--;
        document.getElementById('servings').value = value;
    };

    render() {
        const editDecision = () => {
            if(this.state.editable) {
                return (
                    <div key={_id} className="card-profile-stats">
                        <div className="card-profile-stats-intro">
                            <div className="card-profile-stats-intro-content">
                                <h3 className="meal-title">
                                    <label htmlFor="mealName">Name:</label>
                                    <input type="text" id="mealName" ref="mealName" defaultValue={mealName} />
                                </h3>
                            </div>
                            <button onClick={this.handleClick} className="button small">Cancel</button>
                        </div>
                        <hr />

                        <div className="card-profile-stats-container">
                            <div className="card-profile-stats-statistic">
                                <div className="input-group">
                                    <input className="input-group-field" type="number" ref="cookedWeight" defaultValue={cookedWeight}/>
                                    <span className="input-group-label">g</span>
                                </div>
                                <p>Cooked Weight</p>
                            </div>
                            <div className="card-profile-stats-statistic">
                                <div className="incrementer">
                                    <div className="input-group input-number-group">
                                        <div className="input-group-button">
                                            <button className="input-number-decrement" onClick={this.decrementValue}>-</button>
                                        </div>
                                        <input className="input-number" id="servings" ref="servings" type="number" defaultValue={servings} min="0" max="1000" />
                                        <div className="input-group-button">
                                            <button className="input-number-increment" onClick={this.incrementValue} >+</button>
                                        </div>
                                    </div>
                                </div>
                                <p>Servings</p>
                            </div>
                        </div>
                            <button type="submit" onClick={this.handleSubmit} className="button small">
                                Save
                            </button>
                    </div>

                )
            } else {
                return (
                    <div key={_id} className="card-profile-stats">
                        <div className="card-profile-stats-intro">
                            <div className="card-profile-stats-intro-content">
                                <h3 className="meal-title">
                                    {mealName}
                                </h3>
                            </div>
                            <button onClick={this.handleClick} className="button small">Edit</button>
                        </div>

                        <hr />

                        <div className="card-profile-stats-container">
                            <div className="card-profile-stats-statistic">
                                <span className="stat">{cookedWeight}g</span>
                                <p>Cooked Weight</p>
                            </div>
                            <div className="card-profile-stats-statistic">
                                <span className="stat">{servings}</span>
                                <p>Servings</p>
                            </div>
                            <div className="card-profile-stats-statistic">
                                <span className="stat">{portionSize}g</span>
                                <p>Portion Size</p>
                            </div>
                        </div>
                    </div>
                )
            }
        };
        let {mealName, _id, cookedWeight, servings, portionSize}  = this.state.meal;
        return editDecision()
    }
}

export default Meal;