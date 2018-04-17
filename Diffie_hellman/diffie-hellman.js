'use strict';

const bigInt = require('big-integer');

const getAliceParameters = function (bitLength = 2048) {
    let n = bigInt(4);
    const g = bigInt(2);
    const bits = bigInt(512);

    while (!n.isPrime()) {
        n = bigInt.randBetween(bigInt(2).pow(bits.minus(1)), bigInt(2).pow(bits).minus(1))
    }
    // A genera
    const a = bigInt(bigInt.randBetween(2, n.minus(1)));

    // A envía
    const A = bigInt(g.modPow(a, n));

    let parameters={};
    parameters.n = n;
    parameters.g = g;
    parameters.a = a;
    parameters.A = A;

    return parameters;
}

const getBobParameters = function (n, g, A) {

    const b = bigInt(bigInt.randBetween(2, n.minus(1)));
    const B = bigInt(g.modPow(b, n));

    let parameters={};
    parameters.n = n;
    parameters.g = g;
    parameters.b = b;
    parameters.B = B;

    return parameters;
}

const getDHKey = function (A, a, n){

    const dhKey = bigInt(A.modPow(a, n));
    return dhKey;
}

module.exports = {
    getAliceParameters: getAliceParameters,
    getBobParameters: getBobParameters,
    getDHKey: getDHKey
};



