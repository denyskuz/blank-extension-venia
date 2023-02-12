const fs = require('fs');

function localIntercept(targets) {
  fs.readdirSync(__dirname + '/src/targets/').forEach(file => {
    require('<%= projectVendorName %>/src/targets/' + file)(targets);
  });
}
module.exports = localIntercept;
