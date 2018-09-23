////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    dependencies: ["user"]
    ,process: async function(builder, db, route, user) {

        var public_func = function(item) { return item.get('public'); };

        var organizations = await db.organization.findAll({ offset: 0, limit: 10 });
        builder.output("organizations", organizations.map(public_func));

        if(!user.user) {
            return;
        }

        var memberships = await db.membership.findAll({ where: { user_id: user.user.id }, include: { model: db.organization, as: "organization" } });

        builder.output("memberships", memberships.map(public_func));
    }
};