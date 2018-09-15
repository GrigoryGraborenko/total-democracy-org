
const React = require('react');
const CreateComponent = require('boc/component')(React, require('create-react-class'));

import LoginPage from './login_page.jsx';
import Navbar from './navbar.jsx';

export default CreateComponent({ user : "user", route: "route" }, {
    render() {

        if(this.props.route === null) {
            var page = <div><h1>404</h1></div>;
        } else if(this.props.user === null) {
            var page = <LoginPage store={ this.props.store }/>;
        } else {
            var page = <div><h1>Total democracy</h1></div>;
        }

        return (
            <div id="app-container">
                <Navbar store={this.props.store} />
                <div id="page-container">
                    { page }
                </div>
            </div>
        );
    }
});
