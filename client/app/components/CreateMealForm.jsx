import React from 'react'
import PropTypes from 'prop-types'

import FlashMessage from 'Components/FlashMessage'

class CreateMealForm extends React.Component {

    constructor(props) {
        super(props);
    }

    // This code is commented as the incrementer will be implemented at a later date, this controls the display response
    //
    //
    //incrementValue = (event) => {
    //    let newEvent = new UIEvent("change", {
    //        "view": window,
    //        "bubbles": true,
    //        "cancelable": true
    //    });
    //    document.getElementById('servings').dispatchEvent(newEvent);
    //    event.preventDefault();
    //    let value = parseInt(document.getElementById('servings').value, 10);
    //        value = isNaN(value) ? 0 : value;
    //        value++;
    //        document.getElementById('servings').value = value;
    //};
    //
    //decrementValue = (event) => {
    //    event.preventDefault();
    //    let value = parseInt(document.getElementById('servings').value, 10);
    //    if(value <= 1) {
    //
    //    } else {
    //        value = isNaN(value) ? 0 : value;
    //        value--;
    //        document.getElementById('servings').value = value;
    //    }
    //
    //};

    render() {
        let {onSubmit, onClick, onChange, errors} = this.props;
        return (
            <div>
                {errors.errors.statusMessage  && <FlashMessage message={errors.errors.statusMessage} messageType="alert"/>}
                <div className="card-profile-stats">
                    <div className="card-profile-stats-intro">
                        <div className="card-profile-stats-intro-content">
                            <h3 className="meal-title text-center">
                                Create a new meal
                            </h3>
                        </div>
                    </div>
                    <hr />

                    <div className="card-profile-stats-container">
                        <div className="card-profile-stats-statistic">
                            <form action="" onSubmit={onSubmit}>
                            <label htmlFor="mealName">Name:</label>
                            <input name="mealName" type="text" id="mealName" ref="mealName" required="" onChange={onChange}/>
                            <label htmlFor="cookedWeight">Cooked Weight:</label>
                                <div className="input-group">
                                    <input className="input-group-field" name="cookedWeight" type="number" id="mealName" ref="cookedWeight" required="" onChange={onChange}/>
                                    <span className="input-group-label">g</span>
                                </div>
                            <div className="incrementer">
                                <label htmlFor="servings">Servings:</label>
                                <div className="input-group input-number-group">
                                    {/*<div className="input-group-button">*/}
                                        {/*<button className="input-number-decrement" onClick={this.decrementValue}>-</button>*/}
                                    {/*</div>*/}
                                    <input name="servings" className="input-number" id="servings" ref="servings" type="number" defaultValue="0" min="1" max="1000" onChange={onChange} />
                                    {/*<div className="input-group-button">*/}
                                        {/*<button className="input-number-increment" onClick={this.incrementValue} >+</button>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                                <button type="submit" className="button large">
                                    Submit
                                </button>
                                <button className="button large alert" onClick={onClick}>
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CreateMealForm.contextTypes = {
    router: PropTypes.object.isRequired
};

export default CreateMealForm