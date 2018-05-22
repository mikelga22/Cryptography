'use strict';

const bignum = require('bignum');

const generateRSAKeys = function (bitLength = 1024) {
    //generate p and q
    const p = bignum.prime(bitLength, true);
    const q = bignum.prime(bitLength, true);

    //calculate n and phi(n)
    const n = p.mul(q);
    const phi = (p.sub(1)).mul(q.sub(1));

    //define e and public key
    const e = bignum(65537);
    const kPub = { "e": e.toString(16), "n": n.toString(16) };

    //define d and private key
    const d = e.invertm(phi);
    //const kPrv =
    const privateKey = new RSAPrivateKey(d, n);
    const publicKey = new RSAPublicKey(e, n);

    return { publicKey: publicKey, privateKey: privateKey };
}

const privateKey = function (key) {
    return new RSAPrivateKey(key.d, key.n);
}

const publicKey = function (key) {
    return new RSAPublicKey(key.e, key.n);
}

const hexToUTF8 = function(hexStr) {
    const buff = Buffer.from(hexStr, 'hex');
    return buff.toString();
}

const RSAPrivateKey = class RSAPrivateKey {
    constructor(d, n) {
        this.d = d.toString(16);
        this.n = n.toString(16);
    }

    //mssg is the what you want to sign converted to a hex string
    sign(mssg) {
        //convert string to numeric
        const num = bignum(mssg, 16);
        //ecrypt numeric message
        const enc = num.powm(bignum(this.d, 16), bignum(this.n, 16));

        return enc.toString(16);
    }

    //mssg is a hex string
    decrypt(mssg) {
        //get mmessage from body
        const c = bignum(mssg, 16);
        //decrypt message in numeric format
        const deNum = c.powm(bignum(this.d, 16), bignum(this.n, 16));
        //convert message decrypted to string
        const de = deNum.toString(16);

        return de;
    }
}

const RSAPublicKey = class RSAPublicKey {
    constructor(e, n) {
        this.e = e.toString(16);
        this.n = n.toString(16);
    }

    //mssg is the what you want to encrypt converted to a hex string
    encrypt(mssg) {
        //convert string to numeric
        const num = bignum(mssg, 16);
        //ecrypt numeric message
        const enc = num.powm(bignum(this.e, 16), bignum(this.n, 16));

        return enc.toString(16);
    }

    //mssg is hex string
    verify(mssg) {
        //get mmessage from body
        const c = bignum(mssg, 16);
        //decrypt message in numeric format
        const deNum = c.powm(bignum(this.e, 16), bignum(this.n, 16));
        //convert message decrypted to string
        const de = deNum.toString(16);

        return de;
    }
}

module.exports = {
    getRSAKeys: generateRSAKeys,
    privateKey: RSAPrivateKey,
    privateKey: privateKey,
    publicKey: RSAPublicKey,
    publicKey: publicKey,
    hexToUTF8:hexToUTF8
}