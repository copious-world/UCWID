
import {BaseNormalizer} from './base.js';


export class Unity extends BaseNormalizer {
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
