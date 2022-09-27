//const {introOptions} = require('./intro');
//const {footerOptions} = require('./footer');
const { configureObject,ConfigureText } = require('./functions');
const texts = require('./texts');

const options = {
    width: 800,
    height: 600,
    backgroundColor: 0x7193bc,
    targetSelector: "#animation",
    fontFamilies: ["Roboto", "DS-DIGI"],
    resources: {
        //
    },
};


// load openning resources
if (introOptions) {
    Object.keys(introOptions.resources).forEach((id) => {
        options.resources[id] = introOptions.resources[id];
    });
}

// load footer resources
if (footerOptions) {
    Object.keys(footerOptions.resources).forEach((id) => {
        options.resources[id] = footerOptions.resources[id];
    });
}

const createObjects = (app, resources) => {
    let allObjects = {};

    return allObjects
}

module.exports = {
    options, createObjects
}