var du = require('../utils/dynamic_utils.js');
var qf = require('./criteria/query_factory.js');
var sp = require('../service/service_processor.js');
var configuration = require('./../configuration.js');

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
 * This module has the necessary functions to execute save, load, update and delete operations, create query,
 * update records according to selections and delete records according to selections as well.
 *
 * This class provides the necessary methods to call the Dynamicloud's services.
 *
 * @author Eleazar Gomez
 */
var Provider = {
    /**
     * This method will load a record using recordId.
     *
     * @param recordId        record id
     * @param modelId        model id
     *
     * @return a json object with the data from Dynamicloud
     * @param callback this callback will be called when response it's available.
     */
    loadRecord: function (recordId, modelId, callback) {
        var host = configuration["host"];
        var path = configuration["path.get.record.info"];

        path = path.replace("{csk}", encodeURIComponent(this.credentials.csk)).
            replace("{aci}", encodeURIComponent(this.credentials.aci)).replace("{mid}", modelId).
            replace("{rid}", recordId);

        sp.callGetService(host, path, {
            rid: recordId,
            modelId: modelId
        }, function (kind, json) {
            if (kind === 'OK') {
                callback(null, du.buildRecord(json['record']));
            } else {
                callback('ERROR', json);
            }
        });
    },

    /**
     * This method saves a record into Dynamicloud
     * @param modelId model target
     * @param record record object that will be saved
     *
     * @return the record Id of this new record
     * @param callback this callback will be called when response it's available.  This callback function receives the record with the rid attribute
     */
    saveRecord: function (modelId, record, callback) {
        var host = configuration["host"];
        var path = configuration["path.save.record"];

        path = path.replace("{csk}", encodeURIComponent(this.credentials.csk)).
            replace("{aci}", encodeURIComponent(this.credentials.aci)).replace("{mid}", modelId);

        sp.callPostService(host, path, {
            fields: du.buildFieldsJson(record)
        }, function (kind, json) {
            if (kind === 'OK') {
                record['rid'] = json['rid'];
                callback(null, record);
            } else {
                callback('ERROR', json);
            }
        });
    },

    /**
     * This method will call an update operation in Dynamicloud servers
     * using model and BoundInstance object
     *
     * @param modelId    modelId
     * @param record object that will be saved
     * @param callback this callback will be called when response it's available.
     */
    updateRecord: function (modelId, record, callback) {
        var host = configuration["host"];
        var path = configuration["path.update.record"];

        path = path.replace("{csk}", encodeURIComponent(this.credentials.csk)).
            replace("{aci}", encodeURIComponent(this.credentials.aci));
        path = path.replace("{mid}", modelId);
        path = path.replace("{rid}", record['rid']);

        sp.callPostService(host, path, {
            fields: du.buildFieldsJson(record)
        }, function (kind, json) {
            if (kind === 'OK') {
                callback(null, record);
            } else {
                callback('ERROR', json);
            }
        });
    },

    /**
     * This method will call a delete operation in Dynamicloud servers
     * using model and Record id
     *
     * @param modelId model Id
     * @param recordId   record id
     * @param callback this callback will be called when response it's available.
     */
    deleteRecord: function (modelId, recordId, callback) {
        var host = configuration["host"];
        var path = configuration["path.delete.record"];

        path = path.replace("{csk}", encodeURIComponent(this.credentials.csk)).
            replace("{aci}", encodeURIComponent(this.credentials.aci));
        path = path.replace("{mid}", modelId);
        path = path.replace("{rid}", recordId);

        sp.callDeleteService(host, path, function (kind, json) {
            if (kind === 'OK') {
                callback(null);
            } else {
                callback('ERROR', json);
            }
        });
    },

    /**
     * Will create a Query using the credentials of this provider.
     *
     * @param modelId to execute operations
     * @return query instance
     */
    createQuery: function (modelId) {
        var query = qf.createQuery(modelId);
        query.credentials = this.credentials;

        return query;
    },

    /**
     * Gets model information from Dynamicloud servers.
     *
     * @param modelId model id in Dynamicloud servers
     * @return model object
     */
    loadModel: function (modelId) {

    },

    /**
     * Loads all models related to CSK and ACI keys in Dynamicloud servers
     *
     * @return array of models
     */
    loadModels: function (modelId) {

    },

    /**
     * Loads all model's fields according ModelID
     *
     * @param modelId model Id
     * @return list of model's fields.
     */
    loadFields: function (modelId) {

    },

    /**
     * Executes an update using query as a selection
     *
     * @param query selection
     * @param values is an object with the data to update
     */
    updateWithSelection: function (query, values) {

    },

    /**
     * Executes a delete using query as a selection
     *
     * @param query selection
     */
    deleteWithSelection: function (query) {

    }
};

module.exports = {
    /**
     * This method returns a new instance of provider with the passed credentials
     */
    getProviderInstance: function (credentials) {
        return Object.create(Provider, {
            'credentials': {
                value: credentials,
                writable: false //Avoid changes after this initialization.
            }
        });
    }
};