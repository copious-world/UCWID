const UCWID = require('./lib/UCWID')
const unity_normalizer = require('./lib/normalizers/unity')

const {browser_code} = require('roll-right')


module.exports = UCWID
module.exports.unity_normalizer = unity_normalizer

// provide an interface for retrieving modules and plain JS for inclusions in pages or directories for the bundle.
module.exports.browser_code = () => { return browser_code(__dirname,['normalizers']) }
