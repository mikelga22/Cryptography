"use strict";

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const dh = require ('../diffie-hellman');
const bigInt = require('big-integer');

const app = express();

const parameters = dh.getAliceParameters();

app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));


app.get('/key', function (req, res) {

	res.status(200).send(parameters)

});

app.post('/message', function (req, res) {
	const B = bigInt(req.body.B);
	const mEncrypted = req.body.message;
	let mDecrypted;
	const iv = Buffer.from(req.body.iv);

	//generate the key
	const dhKey = dh.getDHKey(B, parameters.a, parameters.n);
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



