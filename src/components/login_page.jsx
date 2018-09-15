////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const CreateComponent = require('boc/component')(React, require('create-react-class'));
import Action from './action.jsx';

import {
    ControlLabel
    ,Form
    ,FormGroup
    ,FormControl
} from 'react-bootstrap';

export default CreateComponent({ user : "user", pending: "_pending", errors: "_errors" }, {
    getInitialState() {
        return { username: "", password: "" };
    }
    ,handleUsername(evnt) {
        this.setState({ username: evnt.target.value });
    }
    ,handlePassword(evnt) {
        this.setState({ password: evnt.target.value });
    }
    ,handleFail() {
        this.setState({ password: "" });
    }
    ,render() {

        return (
            <div className="container">
                <div>
                    <h3>Login</h3>
                    <Form>
                        <FormGroup validationState={this.props.errors.login ? "error" : null}>
                            <ControlLabel>Email</ControlLabel>
                            <FormControl type="text" placeholder="Enter email..." value={this.state.username} onChange={this.handleUsername} />
                        </FormGroup>
                        <FormGroup validationState={this.props.errors.login ? "error" : null}>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl type="password" placeholder="Enter password..." value={this.state.password} onChange={this.handlePassword} />
                        </FormGroup>
                        <div><b>{ this.props.errors.login }</b></div>
                        <FormGroup>
                            <Action store={this.props.store} name="login" email={ this.state.username } password={ this.state.password } onFail={ this.handleFail } >
                                <button className="btn btn-default" disabled={this.props.pending.login} >{ this.props.pending.login ? "Working..." : "Login" }</button>
                            </Action>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }
})