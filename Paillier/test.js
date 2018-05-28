'use strict';
const paillier = require('./paillier');
const bignum = require('bignum');

const { publicKey, privateKey } = paillier.generateRandomKeys(512); // Change to at least 2048 bits in production state


let num1 = 2;
let num2 = 4;
let num3 = 6;
let bn1 = bignum(num1).mod(publicKey.n);
while (bn1.lt(0)) bn1 = bn1.add(publicKey.n);
let bn2 = bignum(num2).mod(publicKey.n);
while (bn2.lt(0)) bn2 = bn2.add(publicKey.n);
let bn3 = bignum(num3).mod(publicKey.n);
while (bn3.lt(0)) bn3 = bn3.add(publicKey.n);

let c1 = publicKey.encrypt(bn1);
let c2 = publicKey.encrypt(bn2);
let c3 = publicKey.encrypt(bn3);

console.log('num1:', num1.toString());
//console.log('c1:', c1.toString(16), '\n');

console.log('num2:', num2.toString());
//console.log('c2:', c2.toString(16), '\n');

console.log('num3:', num3.toString());
//console.log('c3:', c3.toString(16), '\n');

let encryptedSum = publicKey.addition(c1, c2, c3);
//console.log('E(num1 + num2 + num3):', encryptedSum.toString(16), '\n');

//let sum = bn1.add(bn2).add(bn3).mod(publicKey.n);
let decryptedSum = privateKey.decrypt(encryptedSum);
console.log('Sum:', decryptedSum.toString());
/*console.log(`Expecting ${num1} + ${num2} + ${num3} mod n :`, sum.toString());
console.assert(sum.cmp(decryptedSum) == 0, 'Something went wrong!');*/

/*let encryptedMul = publicKey.multiply(c1, bn2);
console.log(`E(${num1})^${num2} mod n^2 = E(${num2}·${num1} mod n) = ` + encryptedMul.toString(16), '\n');

let mul = privateKey.decrypt(encryptedMul);
console.log('Decryption:', mul.toString());
console.log(`Expecting ${num2}·${num1} mod n :`, bn2.mul(bn1).mod(publicKey.n).toString());*/