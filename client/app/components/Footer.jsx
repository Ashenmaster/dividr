import React from 'react'
import {Link} from 'react-router'

class Footer extends React.Component {
    render() {
        return (
            <footer className="marketing-site-footer">
                <div className="row medium-unstack">
                    <div className="medium-4 columns">
                        <h4 className="marketing-site-footer-name footer-title">Dividr</h4>
                        <p>Quick app to portion up meal sizes, <br/>
                            Any questions or improvements? Get in touch on <a href="mailto:cgray@hourglassdevelopment.co.uk">cgray@hourglassdevelopment.co.uk</a></p>
                    </div>
                </div>
                <div className="marketing-site-footer-bottom">
                    <div className="row large-unstack">
                        <div className="column">
                            <ul className="menu marketing-site-footer-bottom-links">
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                            </ul>
                        </div>
                        <div id="copyright" className="column float-right">
                            <p>&copy; 2017 No rights reserved</p>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer