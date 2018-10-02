////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    dependencies: ["user"]
    ,process: async function(builder, db, route, user) {

        var public_func = function(item) { return item.get('public'); };

        var page_size = 10;
        var offset = ((route.params.page === null) || (route.params.page === undefined)) ? 0 : (Math.max(0, parseInt(route.params.page)) * page_size);

        var organizations_query = await db.organization.findAndCountAll({ offset: offset, limit: page_size });
        var organizations = organizations_query.rows;

        builder.output("organizations", { items: organizations.map(public_func), count: organizations_query.count, page_size: page_size });
        builder.output("selected_organization", null);

        var org_id = builder.getCookie("selected_organization_id");
        if(org_id) {
            let organization = await db.organization.findOne({ where: { id: org_id } });
            if(organization) {
                builder.output("selected_organization", organization.get("public"));
            }
        }

        if(!user.user) {
            builder.output("memberships", null);
            return;
        }

        var memberships = await db.membership.findAll({ where: { user_id: user.user.id }, include: { model: db.organization, as: "organization" } });

        builder.output("memberships", memberships.map(public_func));
    }
};