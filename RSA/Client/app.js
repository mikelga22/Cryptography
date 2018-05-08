const $ = require('jquery');
const request = require('request');
const bignum = require('bignum-browserify');
const bigInt = require ('big-integer');

let pubKey;

function getPubKey() {
    request({
        uri: 'http://localhost:3000/publicKey',
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
                //get the response from the body and convert to JSON
                const bod = JSON.parse(body)
                const e = bignum(bod.e, 16);
                const n = bignum(bod.n, 16);
                //public key obtained
                pubKey = { "e": e, "n": n };
            }

        });
}

$(document).ready(function () {
    getPubKey();

    $("#send").click(function () {
        //read message from input
        const mssg = $("#mssg1").val();
        //convert string to numeric
        const buff = Buffer.from(mssg);
        const num = bignum.fromBuffer(buff);
        //ecrypt numeric message
        const enc = num.powm(pubKey.e, pubKey.n);
        const message = { "message": enc.toString(16) };

        //send to server
        request({
            url: 'http://localhost:3000/message',
            method: 'POST',
            body: message,
            json: true
        }, function (error, response, body) {
            if (error)
                console.log("error2")
            else {
                //print message received
                console.log(body);
                $("#output").val(body);
            }
        });
    });

    $("#sign").click(function () {
        //get message from input
        const mssg = $("#mssg2").val();
        //calculate r
        const n = bigInt(pubKey.n.toString(16),16);
        let rTemp = bigInt.randBetween(0,n);
        while (bigInt.gcd(rTemp,n) != 1) {
            rTemp = bigInt.randBetween(0,n);
        }
        r = bignum(rTemp.toString(16),16)

        //calculate inverse of r
        const rInv = r.invertm(pubKey.n);
        //convert hte message to numeric format
        const buff = Buffer.from(mssg);
        const num = bignum.fromBuffer(buff);
        //calculate r^e mod n
        const r2 = r.powm(pubKey.e, pubKey.n);
        //calculate m*r^e mod n
        const toSend = (num.mul(r2)).mod(pubKey.n);
        const message = { "message": toSend.toString(16) };

        //send message
        request({
            url: 'http://localhost:3000/sign',
            method: 'POST',
            body: message,
            json: true
        }, function (error, response, body) {
            if (error)
                console.log("error2")
            else {
                //get message signed and decrypt to verify
                const received = bignum(body, 16);
                const signed = (received.mul(rInv)).mod(pubKey.n);
                const deNum = signed.powm(pubKey.e, pubKey.n);
                const de = deNum.toBuffer().toString();

                console.log("Message received: ", de);
                $("#output").val(signed.toString(16));
            }
        });
    });

});

