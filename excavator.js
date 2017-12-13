/**
 * Created by Gerwa on 2017/12/12.
 */
const path = require('path');
const ffi = require('ffi');
//如果platform以win开头，那么库

const libexcavator = ffi.Library(path.join(__dirname, /^win/.test(process.platform) ? 'excavator' : 'libexcavator'), {
    'create': ['pointer', []],
    'destroy': ['void', ['pointer']],
    'get_str': ['string', ['pointer']],
    'free_str': ['void', ['pointer']],
    'load': ['pointer', ['pointer']],
    'query': ['pointer', ['pointer', 'string']],
    'get_doc': ['pointer', ['pointer', 'int']],
    'divide_line': ['pointer', ['pointer', 'string']]
});

function json_wrapper(callback) {
    return (err, res) => {
        if (err || !res) {
            callback(err, null);
        } else {
            const result = JSON.parse(libexcavator.get_str(res));
            libexcavator.free_str(res);
            callback(err, result);
        }
    }
}

module.exports = class {
    constructor() {
        this.app = libexcavator.create();
    }

    destroy() {
        libexcavator.destroy(this.app);
    }

    load(callback) {
        libexcavator.load.async(this.app, json_wrapper(callback));
    }

    query_line(words, callback) {
        libexcavator.query.async(this.app, words, json_wrapper(callback));
    }

    get_doc(id, callback) {
        libexcavator.get_doc.async(this.app, id, json_wrapper(callback));
    }

    divide_line(line, callback) {
        libexcavator.divide_line.async(this.app, line, json_wrapper(callback));
    }
};