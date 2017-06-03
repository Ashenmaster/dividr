import React from 'react'
import {Link} from 'react-router'

class DeleteConfirm extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
    let {onClick, message} = this.props;
        return (
            <div className="card-profile-stats">
                <h3>Are you sure?</h3>
                <p>{message}, this not an undoable action.</p>
                <p>Are you sure you want to continue?</p>
                <div className="clearfix">
                    <Link to="/newweek">
                        <button className="float-left alert button">
                            Continue
                        </button>
                    </Link>
                    <button onClick={onClick} className=" float-right button">
                        Cancel
                    </button>
                </div>
            </div>
        )
    }
}

export default DeleteConfirm