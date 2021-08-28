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
    async ucwid(data,no_string) {

        let string_ops = false
        let buf_as_str = false 

        if ( typeof data === "string" ) {  // Just a string, usually some ascii text
            string_ops = true
            buf_as_str = this.normalizer.normalize(data)
            data = Buffer.from(data)        // might use a text encoder
        } else {
            buf_as_str = data.toString('base64url')
            // not yet supporting normalization binary data
        }

        // clear ID
        let clear_cwid = await this.cwid_service.cwid(buf_as_str)  // buf_as_str should be normalized even if it is more advanced DSP normalization as a base64url of normalized bytes
        let c_cwid_hash = clear_cwid.split('!')[1]
        // crypto ID
        let nonce = cwraps.gen_nonce(c_cwid_hash)
        let aes_key = await cwraps.gen_cipher_key()
        let cipher_buffer = await cwraps.encipher_message(data,aes_key,nonce,no_string)
        let cipher_text = false
        if ( no_string ) {
            let buffer = Buffer.from(cipher_buffer)
            cipher_text = buffer.toString('base64url')
        } else {
            cipher_text = cipher_buffer  // it's already text
        }
        //
        let crypto_cwid = await this.cwid_service.cwid(cipher_text)
        // UCWID formation
        let wrapped_key = await cwraps.key_wrapper(aes_key,this._wrapper_key)
        //
        let [u_cwid,ucwid_packet] = await this.ucwid_constructor(clear_cwid,crypto_cwid)
        //
        return { "ucwid" : u_cwid, "info" : {
                                                "ucwid_packet" : ucwid_packet,
                                                "wrapped_key" : wrapped_key,
                                                "nonce" : nonce,
                                                "cipher_buffer" : ( no_string ? cipher_buffer : undefined ),
                                                "cipher_text" : cipher_text,
                                                "type_original" : string_ops ? "string" : "buffer"
                                            }}
    }

}


module.exports = UCWID