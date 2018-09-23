////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const CreateComponent = require('boc/component')(React, require('create-react-class'));

export default CreateComponent({ memberships: "memberships", organization: "selected_organization" }, {
    render() {

        return (
            <div className="container">
                <div>
                    <h3>Landing page</h3>
                </div>
            </div>
        );
    }
})