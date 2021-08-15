
// ---- BaseNomralizer  definition of structure only...  Required methods.

class BaseNomralizer {
    constructor() {
    }

    normalize(data) {
        throw new Error("BaseNomralizer method normalize in UCWID stack requires descendant implementation")
    }

    version() {
        throw new Error("BaseNomralizer method version in UCWID stack requires descendant implementation")
    }
}



module.exports = BaseNomralizer