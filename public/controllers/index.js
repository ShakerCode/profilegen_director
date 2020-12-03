var profiles = require('./profiles.js');
var profiles_mobile = require('./profiles_mobile.js');

module.exports.do_setup = function(app) {
    profiles.run_setup(app);
    profiles_mobile.run_setup(app);
}