"use strict";

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const bigInt = require('big-integer');
const crypto = require('crypto');

const app = express();

let p = bigInt(4);
const g = bigInt(2);
const bits = bigInt(512);

while (!p.isPrime()) {
	p = bigInt.randBetween(bigInt(2).pow(bits.minus(1)), bigInt(2).pow(bits).minus(1))
}
// A genera
const a = bigInt(bigInt.randBetween(2, p.minus(1)));

// A envía
const ga = bigInt(g.modPow(a, p));


app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));


app.get('/key', function (req, res) {
	let response = {};

	response.p = p;
	response.g = g;
	response.A = ga;

	res.status(200).send(response)

});

app.post('/message', function (req, res) {
	const B = bigInt(req.body.B);
	const mEncrypted = req.body.message;
	let mDecrypted;
	const iv = Buffer.from(req.body.iv);

	//generate the key
	const dhKey = bigInt(B.modPow(a, p));
	const key = Buffer.from(dhKey.toString(16), 'hex').slice(0, 32);

	//decryp message
	let decipher = crypto.createDecipheriv('aes256', key, iv);
	mDecrypted = decipher.update(mEncrypted, 'hex', 'utf8');
	mDecrypted += decipher.final('utf8');

	console.log("Decrypted message: ", mDecrypted)

	res.status(200).send("ok")


});

//Listen on port 3000
app.listen(3000);
console.log("Server listeneing on port 3000");


/*var text ="Hola que tal"


// B genera
var b = bigInt(bigInt.randBetween(2, p.minus(1)));

var gb = bigInt(g.modPow(b,p));

var kab = bigInt(gb.modPow(a,p));
var kba = bigInt(ga.modPow(b,p));

console.log ("kab: ",kab.toString(16))

const cipher = crypto.createCipher('aes192', kab.toString(16));

let encrypted = cipher.update(text, 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log("message encrypted: ",encrypted);

const decipher = crypto.createDecipher('aes192', kba.toString(16));
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log("message decrypted: ",decrypted);*/


