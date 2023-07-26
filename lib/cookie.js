const PSON = require('pson')
const uid = ['123-xxx-xxx-eee-xxx']
const pson = new PSON.ProgressivePair(uid)
// const pub = require('fs').readFileSync('')

const s = {
    ser: function (d) {
        return pson.encode(d).toString('hex').toUpperCase()
      },  
    dser: function (d) {
        return pson.decode(Buffer.from(d, 'hex'))
    }
}

module.exports = s