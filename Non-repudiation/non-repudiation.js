'use strict';

const bignum = require('bignum');
const rsa = require('../RSA/rsa');
const crypto = require ('crypto');

const generateProof = function(params, key){
    const hash = crypto.createHash('sha256').update(params).digest('hex');
    const privateKey = rsa.privateKey(key);
    const proof = privateKey.sign(hash);
    return proof;
}

const checkProof = function(params, proof, key){
    const hash = crypto.createHash('sha256').update(params).digest('hex');
    const publicKey = rsa.publicKey(key);
    const verify = publicKey.verify(proof)
    
    return (hash==verify);
}

module.exports = {
    getProof:generateProof,
    checkProof: checkProof
}


