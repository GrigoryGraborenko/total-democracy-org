////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const CreateComponent = require('boc/component')(React, require('create-react-class'));
import Action from './action.jsx';

export default CreateComponent({ user : "user", route: "route", pending: "_pending" }, {
    getInitialState() {
        return { dropdown: false };
    }
    ,handleDropdownToggle() {
        this.setState({ dropdown: (!this.state.dropdown) });
    }
    ,renderMenuRoute(is_mobile, menu_route, index) {

        if(!menu_route.label) {
            return <div key={ index } className="spacer"></div>;
        }
        var is_active = this.props.route.name === menu_route.action;
        var callback = is_mobile ? this.handleDropdownToggle : null;
        var class_name = "pointer" + (is_active ? " bold italics" : "");
        class_name += is_mobile ? "" : " hidden-mobile";
        if(menu_route.className) {
            class_name += " " + menu_route.className;
        }

        return (
            <div key={ index } className={ class_name }>
                <Action store={ this.props.store } name={ menu_route.action } linkless={ true } onClick={ callback }>
                    { menu_route.label }
                </Action>
            </div>
        );

    }
    ,render() {

        if(this.props.user) {

            var menu_routes = [
            ];
            menu_routes.push({});
            // menu_routes.push({ action: "profile", label: "Profile" });
            menu_routes.push({ action: "logout", label: "Logout" });
        } else {
            var menu_routes = [{ action: "home_page", label: "Login", className: "visible-mobile" }, {}];
        }

        return (
            <div id="navbar-container">
                <div id="navbar">
                    <div id="navbar-logo">
                        <Action store={ this.props.store } name="home_page" linkless={ true } className="pointer">
                            <img src="" />
                        </Action>
                    </div>
                    { menu_routes.map(this.renderMenuRoute.bind(this, false)) }
                    <div id="hamburger" className="visible-mobile" onClick={ this.handleDropdownToggle }>
                        <i className="fa fa-bars" aria-hidden="true" />
                    </div>
                </div>
                <div id="navbar-dropdown" className={ "visible-mobile" + (this.state.dropdown ? " active" : "") }>
                    { menu_routes.map(this.renderMenuRoute.bind(this, true)) }
                </div>
            </div>
        );
    }
})