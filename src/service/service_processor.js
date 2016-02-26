/**
 * Copyright (c) 2016 Dynamicloud
 * <p/>
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * <p/>
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * <p/>
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * <p/>
 *
 * This module is a service processor that provides functions to execute Restful request to Dynamicloud's servers
 *
 * @author Eleazar Gomez
 */
var queryString = require('querystring');
var https = require('https');

module.exports = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    /**
     * Will call a service using Get method.
     *
     * @param host
     * @param path service url to be called
     * @param params parameters
     * @param callback this callback will be executed even this request throws an error, the first parameter will indicate the kind of response (ERROR, OK)
     */
    callGetService: function (host, path, params, callback) {
        return this.callService(host, path, params, this.GET, callback);
    },
    /**
     * Will call a service using Post method.
     *
     * @param host
     * @param path service url to be called
     * @param params     parameters
     * @param callback this callback will be executed even this request throws an error, the first parameter will indicate the kind of response (ERROR, OK)
     */
    callPostService: function (host, path, params, callback) {
        return this.callService(host, path, params, this.POST, callback);
    },
    /**
     * Will call a service using Post method.
     *
     * @param host
     * @param path service url to be called
     * @param callback this callback will be executed even this request throws an error, the first parameter will indicate the kind of response (ERROR, OK)
     */
    callDeleteService: function (host, path, callback) {
        return this.callService(host, path, null, this.DELETE, callback);
    },
    /* Will call a service.
     *
     * @param serviceUrl service url to be called
     * @param params     parameters
     * @param method     method to use
     * @param callback this callback will be executed even this request throws an error, the first parameter will indicate the kind of response (ERROR, OK)
     * @return a ServiceResponse from Dynamicloud's servers
     */
    callService: function (host, path, params, method, callback) {
        var data = params == null ? '' : queryString.stringify(params);
        var version = require('../configuration.js')['version'];

        var options = {
            hostname: host,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Content-Length': data.length,
                "Origin": "Dynamicloud://API",
                "Accept-Encoding": "deflate",
                "Dynamicloud-API": "NodeJS",
                "User-Agent": "Dynamicloud Client",
                "API-Version": version
            },
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');

            var response = '';

            res.on('data', function (chunk) {
                response += chunk;
            });

            res.on('end', function () {
                try {
                    var json = JSON.parse(response);
                    if (json.status == null || json.status == 200) {
                        callback('OK', json);
                    } else {
                        callback('ERROR', json.message);
                    }
                } catch (e) {
                    callback('ERROR', "It couldn't parse the json from Dynamicloud - (" + response + ")");
                }
            });
        });

        req.on('error', function (e) {
            callback('ERROR', e.message);
        });

        req.write(data);
        req.end();
    }
};