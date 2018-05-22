'use strict';

const bignum = require('bignum');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const rsa = require('../rsa')

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

//allow cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const keys = rsa.getRSAKeys(128);

app.get('/publicKey', function (req, res) {
    //const key = { "e": kPub.e.toString(16), "n": kPub.n.toString(16) };
    res.status(200).send(keys.publicKey);
});

app.get('/test', function (req, res) {
    //const key = { "e": kPub.e.toString(16), "n": kPub.n.toString(16) };
    res.status(200).send({"key": rsa.getRSAKey(128)});
});

app.post('/sign', function (req, res) {
    //get mmessage from body
    //const c = bignum(req.body.message, 16);
    //sign message
    //const signed = c.powm(d, n);
    const signed = keys.privateKey.sign(req.body.message);

    res.status(200).send(signed.toString(16));
});

app.post('/message', function (req, res) {
    //get mmessage from body
    /*const c = bignum(req.body.message, 16);
    //decrypt message in numeric format
    const deNum = c.powm(d, n);
    //convert message decrypted to string
    const de = deNum.toBuffer().toString();
    //print decrypted message*/
    console.log(req.body.message)
    const de = keys.privateKey.decrypt(req.body.message);

    res.status(200).send("Message received: "+ rsa.hexToUTF8(de));
});

/*const m = "a";
//convert string to buffer
const mBuff = Buffer.from(m);
//convert buffer to bignum
const mNum = bignum.fromBuffer(mBuff);
//encrypt message
const c = mNum.powm(e, n);
const qw = c.toString(16);

const qwe = bignum(qw,16);

//decrypt message
const dNum = qwe.powm(d, n);
//convert message decrypted to string
const dee = dNum.toBuffer().toString();

console.log(dee);*/

//Listen on port 3000
app.listen(3000);
console.log("Server listeneing on port 3000");