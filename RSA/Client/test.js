const rsa = require('../rsa');
const request = require('request');

let pubKey;

function getPubKey() {
    request({
        uri: 'http://localhost:3000/test',
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
                console.log(bod)
                const key = rsa.privateKey(bod.key);
                key.test();
            }

        });
}

getPubKey();