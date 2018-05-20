const ss = require('./secret-sharing');

//get keys fot the secret

const keys = ss.shareSecret(4, 7, 654615);
//console.log("keys", keys);
let combine = [];
combine.push(keys[0]);
combine.push(keys[1]);
combine.push(keys[3]);
combine.push(keys[5]);

//combine some keys
console.log(ss.combineKeys(combine));