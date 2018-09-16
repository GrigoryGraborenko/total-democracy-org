
var actions = {
    login: { server: true }
    ,logout: { server: true }
    ,profile: { url: "/profile" }
    ,change_password: { server: true, entry: "user" }

    ,change_organization: { server: true, store: function(input) {
        return { selected_organization_id: input.organization_id };
    }}

    ,home_page: { url: "/" }
};

export default actions;