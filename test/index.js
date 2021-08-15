const test = require('ava');
let UCWID = require('../lib/UCWID.js')

test('primary-unity', async t => {
    //
    let ucwid_service = new UCWID({})
    let [key_wait,key_promise] = ucwid_service.wait_for_key()
    if ( key_wait ) {
        await key_promise
    }

    let data = "this is a test"
    let my_ucwid = await ucwid_service.ucwid(data)

    console.dir(my_ucwid)

    t.pass("this is great")
})
