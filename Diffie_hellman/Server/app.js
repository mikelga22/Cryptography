"use strict";

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const dh = require('../diffie-hellman');
const bigInt = require('big-integer');

const app = express();

const param = new dh.DH(dh.DH.getDHParams(), 2);
/*const A = bigInt(param.A,16);
const g = bigInt(param.g,16);
const p = bigInt(param.p,16);

const dhParam= new dh.DH(p, g);
const keyA= param.sharedKey(bigInt(dhParam.A,16));
const keyB = dhParam.sharedKey(bigInt(param.A,16));

console.log("A", keyA.toString(16));
console.log("B", keyB.toString(16))*/

app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));


app.get('/key', function (req, res) {

	let paramToSend={};
	paramToSend.A=param.A;
	paramToSend.g=param.g;
	paramToSend.p=param.p;
	res.status(200).send(paramToSend)

});

app.post('/message', function (req, res) {
	const B = bigInt(req.body.B,16);
	const mEncrypted = req.body.message;
	let mDecrypted;
	const iv = Buffer.from(req.body.iv);
	//generate the key
	const dhKey = param.sharedKey(B);
	console.log("key", dhKey.toString(16))
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



