/**
 * Created by Grigory on 18/03/2018.
 */

const React = require('react');
const CreateComponent = require('boc/component')(React);

export default CreateComponent({ }, {
    render() {
        return (
            <div id="app-container">
                <h1>Total democracy</h1>
            </div>
        );
    }
});
