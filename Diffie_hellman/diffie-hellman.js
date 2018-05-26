'use strict';

const bigInt = require('big-integer');
const crypto = require('crypto');

bigInt.rand = function (bitLength) {
    let bytes = bitLength / 8;
    let buf = Buffer.alloc(bytes);
    crypto.randomFillSync(buf);
    buf[0] = buf[0] | 128;  // first bit to 1 -> to get the necessary bitLength
    return bigInt.fromArray([...buf], 256);
};

bigInt.randBetween = function (start, end) {  // crypto rand in [start, end]
    let interval = end.subtract(start);
    let arr = interval.toArray(256).value;
    let buf = Buffer.alloc(arr.length);
    let bn;
    do {
        crypto.randomFillSync(buf);
        bn = bigInt.fromArray([...buf], 256).add(start);
    } while (bn.compare(end) >= 0 || bn.compare(start) < 0);
    return bn;
};

bigInt.prime = function (bitLength) {
    let rnd;
    do {
        rnd = bigInt.rand(bitLength);
        console.assert(rnd.bitLength() == bitLength, 'ERROR: ' + rnd.bitLength() + ' != ' + bitLength);
    } while (!rnd.isPrime());
    return bigInt(rnd);
};

bigInt.prototype.bitLength = function () {
    let bits = 1;
    let result = this;
    const two = bigInt(2);
    while (result.greater(bigInt.one)) {
        result = result.divide(two);
        bits++;
    }
    return bits;
};

const DH = class DH {
    constructor(p, g) {
        this.p = bigInt(p).toString(16);
        this.g = bigInt(g).toString(16);

        const pTemp=bigInt(p);
        const gTemp=bigInt(6);
        this.a = bigInt(bigInt.randBetween(2, pTemp.minus(1))).toString(16);
        this.A = bigInt(gTemp.modPow(bigInt(this.a,16), pTemp)).toString(16);
    }

    sharedKey (B){
        return B.modPow(bigInt(this.a,16),bigInt(this.p,16))//.toString(16);
    }

    static getDHParams (bits = 512) {
        const p = bigInt.prime(bits);
        return p;
    }
}

module.exports = {
    DH: DH
};


