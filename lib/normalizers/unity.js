const BaseNomralizer = require('./base')


class Unity extends BaseNomralizer {
    //
    constructor() {
        super()
    }

    normalize(data) {
        return data
    }

    version() {
        return "0101"
    }

}


module.exports = Unity