const nr = require('./non-repudiation');
const crypto = require ('crypto');
const rsa = require('../RSA/rsa');

const a = "A";
const b = "B";
const m = "This is the secret message";
const ttp = "TTP";

const k = "Symmetric key";
const cipher = crypto.createCipher('aes256', k.toString(16));
let c = cipher.update(m, 'utf8', 'hex');
c += cipher.final('hex');

const keys = rsa.getRSAKeys(512);

const array = new Array(a, b, c);
const concat = array.join(',');

const proof = nr.getProof(concat, keys.privateKey);
console.log("check",nr.checkProof(concat,proof, keys.publicKey));
