const fsPromises = require('fs/promises')


// for rolling this up when the directory structure is not known e.g. from npm and for pnpm
async function web_page_getter() {
    try {
        let file_info = await fsPromises.readFile('../client/UCWID.js')
        let js_str = file_info.toString()
        return {
            "UCWID" : js_str
        }
    } catch (e) {
    }
    return false
}


module.exports.web_page_getter = web_page_getter