////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const CreateComponent = require('boc/component')(React, require('create-react-class'));

export default CreateComponent({ route: "route", organizations: "organizations", memberships: "memberships", organization: "selected_organization" }, {
    handleSelect(organization_id) {
        this.action("change_organization", { organization_id: organization_id });
    }
    ,handlePage(page) {
        this.action("organizations", { page: (page ? page : null) });
    }
    ,renderOrganization(member_orgs, organization) {

        var name = null;
        if(this.props.memberships) {
            var member = member_orgs[organization.id];
            var is_selected = this.props.organization && (this.props.organization.id === organization.id);
            if(member) {
                name = <b className={ "pointer" + (is_selected ? " italics" : "") } onClick={ this.handleSelect.bind(this, is_selected ? "" : organization.id) }>{ organization.name }</b>;
                if(is_selected) {
                    var join_org = <div className="right-align">&rarr;</div>;
                }
            }
        }
        if(!name) {
            name = organization.name;
            var join_org = <button className="btn btn-success btn-xs" >Join</button>;
        }
        return (
            <tr key={ organization.id }>
                <td>{ join_org }</td>
                <td>{ name }</td>
            </tr>
        );
    }
    ,render() {

        var member_orgs = {};
        if(this.props.memberships) {
            this.props.memberships.forEach(function(member) {
                member_orgs[member.organization.id] = member;
            });
        }

        var orgs = this.props.organizations.items.slice(0);
        orgs.sort(function(a, b) {
            if(member_orgs[a.id] && (!member_orgs[b.id])) {
                return -1;
            } else if((!member_orgs[a.id]) && member_orgs[b.id]) {
                return 1;
            }
            return a.name.localeCompare(b.name);
        });

        var page = (this.props.route.params.page === null) ? 0 : (parseInt(this.props.route.params.page));
        var max_page = Math.ceil(this.props.organizations.count / this.props.organizations.page_size) - 1;

        return (
            <div className="container">
                <div>
                    <h3>Organizations</h3>
                    <table className="organization-table">
                        <tbody>
                            { orgs.map(this.renderOrganization.bind(this, member_orgs)) }
                        </tbody>
                    </table>
                </div>
                <button onClick={ this.handlePage.bind(this, Math.max(0, page - 1)) } className={"btn btn-primary" + ((page > 0) ? "" : " disabled") } >Previous</button>
                <button onClick={ this.handlePage.bind(this, Math.min(max_page, page + 1)) } className={"btn btn-primary" + (((page + 1) <= max_page) ? "" : " disabled") } >Next</button>
                <span> page { page + 1 }/{ max_page + 1 } - { this.props.organizations.count } total</span>
            </div>
        );
    }
})