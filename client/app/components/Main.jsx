import React from 'react';

import Header from './Header';
import Footer from './Footer';


class Main extends React.Component {


    render() {
        return (
            <div>
                <Header />
                <div className="content">
                        {this.props.children}
                </div>
                <Footer />
            </div>
        )
    }

}

module.exports = Main;