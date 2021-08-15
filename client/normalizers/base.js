
// ---- BaseNormalizer  definition of structure only...  Required methods.

export class BaseNormalizer {
    constructor() {
    }

    normalize(data) {
        throw new Error("BaseNormalizer method normalize in UCWID stack requires descendant implementation")
    }

    version() {
        throw new Error("BaseNormalizer method version in UCWID stack requires descendant implementation")
    }
}

