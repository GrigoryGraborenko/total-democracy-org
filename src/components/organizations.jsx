////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const CreateComponent = require('boc/component')(React, require('create-react-class'));

export default CreateComponent({ organizations: "organizations", memberships: "memberships", organization: "selected_organization" }, {
    renderOrganization(organization) {

        var name = organization.name;
        if(this.props.memberships) {
            var member = this.props.memberships.find(function(membership) {
                return membership.organization.id === organization.id;
            });
            if(member) {
                name = <b>{ name }</b>;
            }
        }
        return (
            <div key={ organization.id }>
                { name }
            </div>
        );
    }
    ,render() {

        return (
            <div className="container">
                <div>
                    <h3>Organizations</h3>
                    { this.props.organizations.map(this.renderOrganization) }
                </div>
            </div>
        );
    }
})