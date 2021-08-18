const CWID = require('cwid')
const cwraps = require('crypto-wraps')



class UCWID {
    //
    constructor(conf) {
        //
        this.cwid_service = new CWID()
        //
        this.key_pack = false
        if ( (conf === undefined) || (conf.normalizer === undefined) ) {
            let Normal = require('./normalizers/unity')
            this.normalizer = new Normal(conf)
        } else {
            let Normal = (typeof conf.normalizer === 'string') ? require(conf.normalizer) : conf.normalizer
            if ( typeof conf.normalizer === "function" ) this.normalizer = conf.normalizer(conf) 
            else this.normalizer = new Normal(conf)   
        }
        if ( (conf === undefined) || (conf._wrapper_key === undefined) ) {
            this.key_wait = true
            this.key_promise = new Promise((resolve,reject) => {
                (async () => { await this.provide_keys(); this.key_wait = false; resolve(true) })()
            })
        } else {
            this.key_wait = false
            this._wrapper_key = conf._wrapper_key
        }
    }

    wait_for_key() {
        return [this.key_wait, this.key_promise]
    }

    key_package() {
        return this.key_pack
    }

    //
    async provide_keys() {
        let key_pack = await cwraps.galactic_user_starter_keys("wrapper")
        this._wrapper_key = key_pack.pk_str
        this.key_pack = key_pack
        return key_pack
    }

    set wrapper_key(wkey) {
        this._wrapper_key = wkey
    }

    get wrapper_key() {
        return this._wrapper_key
    }

    async ucwid_constructor(clear_cwid,crypto_cwid) {
        let ucwid_packet = {
            "clear_cwid" : clear_cwid,
            "crypto_cwid" : crypto_cwid
        }
        let n_version = this.normalizer.version()
        let pack_str = JSON.stringify(ucwid_packet)
        let packet_cwid = await this.cwid_service.cwid(pack_str)
        let u_cwid = n_version + '!' + packet_cwid
        return [u_cwid,ucwid_packet]     
    }

    //
    async ucwid(data) {

        let normalize = false
        let buf_as_str = false 

        if ( typeof data === "string" ) {
            normalize = true
            let buffer = Buffer.from(data)
            buf_as_str = buffer.toString('base64url')
            data = this.normalizer.normalize(data)
        } else {
            data = data.toString('base64url')
            buf_as_str = data
        }

        // clear ID
        let clear_cwid = await this.cwid_service.cwid(data)

        // crypto ID
        let nonce = cwraps.gen_nonce()
        let aes_key = await cwraps.gen_cipher_key()
        let cipher_text = await cwraps.encipher_message(buf_as_str,aes_key,nonce)
        let crypto_cwid = await this.cwid_service.cwid(cipher_text)
        //
        // UCWID formation
        let wrapped_key = await cwraps.key_wrapper(aes_key,this._wrapper_key)
        //

        let [u_cwid,ucwid_packet] = await this.ucwid_constructor(clear_cwid,crypto_cwid)
        //
        return { "ucwid" : u_cwid, "info" : {
                                                "ucwid_packet" : ucwid_packet,
                                                "wrapped_key" : wrapped_key,
                                                "nonce" : nonce,
                                                "cipher_text" : cipher_text,
                                                "type_original" : normalize ? "string" : "buffer"
                                            }}
    }
}


module.exports = UCWID