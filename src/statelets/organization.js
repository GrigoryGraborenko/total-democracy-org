////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    dependencies: ["user"]
    ,process: async function(builder, db, route, user) {

        if(!user.user) {
            return;
        }

        var memberships = await db.membership.findAll({ where: { user_id: user.user.id }, include: { model: db.organization, as: "organization" } });

        var public_func = function(item) { return item.get('public'); };

        builder.output("memberships", memberships.map(public_func));

    }
};