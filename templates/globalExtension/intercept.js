const fs = require('fs');

function localIntercept(targets) {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap((flags) => {
        /**
         *  Wee need to activated esModules and cssModules to allow build pack to load our extension
         * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
         */
        flags[targets.name] = {
            cssModules: true,
            esModules: true,
            graphqlQueries: true,
            rootComponents: true
        };
    });
    // add your extensions to trust vendors of the project
    fs.readdirSync(__dirname + '/src/targets/').forEach((file) => {
        require('<%= projectVendorName %>/src/targets/' + file)(targets);
    });
}
module.exports = localIntercept;
