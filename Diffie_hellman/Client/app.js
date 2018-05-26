const request = require('request');
const dh = require ('../diffie-hellman');
const bigInt = require('big-integer');
const crypto = require('crypto');

const text = "Whitfield Diffie y Martin Hellman recibieron el prestigioso premio A.M. Turing de 2015 de la Association for Computer Machinery en 2016 por este trabajo que revolucionó la seguridad informática.";

const bits = 128;

request({
    uri: 'http://localhost:3000/key',
    method: "GET",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10
},

    function (error, response, body) {
        //console.log(body);
        if (error)
            console.log("error1")
        else {
            const r = JSON.parse(body)
            //console.log(response)

            const p = bigInt(r.p,16);
            const g = bigInt(r.g, 16);
            const A = bigInt(r.A, 16);

            const dhParams = new dh.DH(p, g);

            //generate key
            const dhKey = dhParams.sharedKey(A);
            console.log(dhKey.toString(16))

            const key = Buffer.from(dhKey.toString(16), 'hex').slice(0, 32);

            const iv = Buffer.from(crypto.randomBytes(16));

            //encrypt message
            const cipher = crypto.createCipheriv('aes256', key, iv);
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            //console.log(encrypted);

            let message = {};
            message.B=dhParams.A;
            message.iv = iv;
            message.message=encrypted;

            request({
                url: 'http://localhost:3000/message',
                method: 'POST',
                body: message,
                json: true
            }, function (error, response, body) {
                if (error)
                    console.log("error2")
                else
                    console.log(body);
            });

            //console.log(message)
        }

    });
