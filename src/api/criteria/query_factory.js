"use strict";

var dc = require('../criteria/dynamic_criteria.js');
var du = require('../../utils/dynamic_utils.js');
var configuration = require('../../configuration.js');
var sp = require('../../service/service_processor.js');

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
 * This module implements the necessary methods to execute operations.
 *
 * @author Eleazar Gomez
 */
module.exports = {
    createQuery: function (modelId) {
        var props = {
            'modelId': {
                value: modelId,
                writable: false //Avoid changes after this initialization.
            },
            'credentials': {
                value: '',
                writable: true
            },
            'innerOrderBy': {
                value: null,
                writable: true
            },
            'innerGroupBy': {
                value: null,
                writable: true
            },
            'projections': {
                value: [],
                writable: true
            },
            'offset': {
                value: 0,
                writable: true
            },
            'count': {
                value: 0,
                writable: true
            },
            'listWasCalled': {
                value: false,
                writable: true
            },
            'joins': {
                value: [],
                writable: true
            },
            'alias': {
                value: null,
                writable: true
            },
            'conditions': {
                value: [],
                writable: true
            }
        };

        return Object.create(Query, props);
    }
};

var Query = {
    /**
     * Apply a asc ordering to the current order by object
     * An Error will be thrown if orderBy object is null
     *
     * @return Query instance
     */
    asc: function () {
        if (this.innerOrderBy == null) {
            throw new Error("You must call orderBy method before call this method");
        }

        this.innerOrderBy.asc = true;

        return this;
    },
    /**
     * Apply a desc ordering to the current order by object
     * An Error will be thrown if orderBy object is null
     *
     * @return Query instance of Query
     */
    desc: function () {
        if (this.innerOrderBy == null) {
            throw new Error("You must call orderBy method before call this method");
        }

        this.innerOrderBy.asc = false;

        return this;
    },
    /**
     * This method adds an order by condition.  The condition will have an asc ordering by default.
     *
     * @param attribute attribute by the query will be ordered.
     * @return Query instance
     */
    orderBy: function (attribute) {
        this.innerOrderBy = dc.getConditionInstance().orderBy(attribute);
        return this;
    },
    /**
     * This method create a groupBy condition using attribute
     *
     * @param attributes attributes by this query will group.
     * @return Query instance
     */
    groupBy: function (attributes) {
        this.innerGroupBy = dc.getConditionInstance().groupBy(attributes);
        return this;
    },
    /**
     * Add a join to the list of joins
     *
     * @param joinClause join clause
     * @return Query instance
     */
    join: function (joinClause) {
        this.joins.push(joinClause);
        return this;
    },
    /**
     * This method will add a new condition to an AND list of conditions.
     *
     * @param condition new condition to a list of conditions to use
     * @return Query instance
     */
    add: function (condition) {
        this.conditions.push(condition);
        return this;
    },
    /**
     * This method will execute a query and returns a list of records
     *
     * @throws An exception if any error occurs.
     * @param callback this callback will be called when response it's available.  This callback function receives the records from Dynamicloud
     */
    getResults: function (callback) {
        this.getResultsByProjection(null, callback);
    },
    /**
     * This method will execute a query and returns a list of records
     *
     * @throws An exception if any error occurs.
     * @param projection projection for this query
     * @param callback this callback will be called when response it's available.  This callback function receives the records from Dynamicloud
     */
    getResultsByProjection: function (projection, callback) {
        this.projections = projection;

        var criteria = du.buildString(this.conditions, this.innerGroupBy, this.innerOrderBy,
            du.buildProjection(this.projections), this.alias, this.joins);

        var host = configuration["host"];

        var path;
        if (this.projections == null || this.projections.length == 0) {
            path = configuration["path.get.records"];
        } else {
            path = configuration["path.get.projection.fields"];
        }

        path = path.replace("{csk}", encodeURIComponent(this.credentials.csk)).replace("{aci}",
            encodeURIComponent(this.credentials.aci)).replace("{mid}", this.modelId).replace("{count}", this.count).
            replace("{offset}", this.offset);

        var instance = this;
        sp.callPostService(host, path, {
            'criteria': criteria
        }, function (kind, json) {
            if (kind === 'OK') {
                instance.listWasCalled = true;

                callback(null, du.buildRecordResults(json));
            } else {
                callback('ERROR', json);
            }
        });
    },
    /**
     * Will execute a getResults operation with an offset += count.
     * If getResults() method without callback was called, then this method will return a results object otherwise null
     *
     * @param callback this callback will be called when response it's available.  This callback function receives the records from Dynamicloud
     * @throws Error if any error occurs.
     */
    next: function (callback) {
        if (!this.listWasCalled) {
            throw new Error("You have to call either getResults(callback) or getResultsByProjection methods first.");
        }

        this.offset = this.offset + this.count;

        return this.getResults(callback);
    }
};