////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
const React = require('react');
const CreateComponent = require('boc/component')(React, require('create-react-class'));

// TODO: remove this
export default CreateComponent({ memberships: "memberships", organization: "selected_organization" }, {
    getInitialState() {
        return { selected_id: "" };
    }
    ,handleChange(evnt) {
        var new_id = evnt.target.value;
        this.setState({ selected_id: new_id });
        this.action("change_organization", { organization_id: new_id });
    }
    ,renderMembershipOption(membership) {
        var org = membership.organization;
        return <option key={ org.id } value={ org.id }>{ org.name }</option>;
    }
    ,render() {

        if(this.props.memberships) {
            var options = this.props.memberships.map(this.renderMembershipOption);
        } else {
            var options = [];
        }

        return (
            <div className="container">
                <div>
                    <h3>Pick</h3>
                    <select className="form-control" value={ this.state.selected_id } onChange={ this.handleChange }>
                        <option value="">Select organization...</option>
                        { options }
                    </select>
                </div>
            </div>
        );
    }
})
*/