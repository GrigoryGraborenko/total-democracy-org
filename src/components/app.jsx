
const React = require('react');
const CreateComponent = require('boc/component')(React, require('create-react-class'));

import Landing from './landing.jsx';
import LoginPage from './login_page.jsx';
import Navbar from './navbar.jsx';
import Organizations from './organizations.jsx';
// import PickOrganization from './pick_organization.jsx';

export default CreateComponent({ user : "user", route: "route", organization: "selected_organization" }, {
    getInitialState() {
        return { login: false };
    }
    ,render() {

        if(this.props.route === null) {
            var page = <div><h1>404</h1></div>;
        } else if(this.props.route.name === "login_page") {
            var page = <LoginPage store={ this.props.store }/>;
        } else if(this.props.route.name === "home_page") {
            var page = <Landing store={ this.props.store }/>;
        } else if(this.props.route.name === "organizations") {
            var page = <Organizations store={ this.props.store }/>;
        // } else if(!this.props.organization) {
        //     var page = <PickOrganization store={ this.props.store } />;
        } else {
            var page = <div><h1>Total democracy</h1></div>;
        }

        return (
            <div id="app-container">
                <Navbar store={ this.props.store } />
                <div id="page-container">
                    { page }
                </div>
            </div>
        );
    }
});
