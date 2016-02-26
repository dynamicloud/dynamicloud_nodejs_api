var _ = require('./array_utils.js');
var $ = require('./object_utils.js');

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
 * This module has utility methods to handle general situations.
 *
 * @author Eleazar Gomez
 */

module.exports = {
    /**
     * This method builds the tag joins as follows:
     * i.e: "joins": [ { "type": "full", "alias": "user", "target": "3456789", "on": { "user.id" : "languages.id" } } ]
     *
     * @param joins list of join clauses
     * @return string representation of a join tag.
     */
    buildJoinTag: function (joins) {
        var tag = "\"joins\": [";

        if (joins != null) {
            var firstTime = true;

            _.each(joins, function (clause) {
                tag += (firstTime ? "" : ", ") + clause.toRecordString({});

                firstTime = false;
            });
        }

        return tag + "]";
    },
    /**
     * Builds a compatible String to use in service executions
     *
     * @param conditions conditions to handle
     * @param groupBy current groupBy
     * @param orderBy current orderBy
     * @param projection current projection
     * @param alias this is the alias attached to the select model
     * @return string String
     * @throws Error if any error occurs
     * @param joins
     */
    buildString: function (conditions, groupBy, orderBy, projection, alias, joins) {
        var dc = require('../api/criteria/dynamic_criteria.js');

        var built = "{" + (alias == null ? "" : "\"alias\": \"" + alias + "\",") + this.buildJoinTag(joins) +
            (projection === null || projection === "" ? "" : (", " + projection)) + ", \"where\": {";

        if (conditions.length > 0) {
            var global = conditions[0];
            if (conditions.length > 1) {
                conditions = _.subArray(conditions, 1);
                _.each(conditions, function (condition) {
                    global = dc.getConditionInstance().and(global, condition);
                });
            }

            built += global.toRecordString({});
        }

        built += "}";

        if (groupBy != null) {
            built += "," + groupBy.toRecordString({});
        }

        if (orderBy != null) {
            built += "," + orderBy.toRecordString({});
        }

        return built + "}";
    },
    /**
     * Build a compatible string using projection
     *
     * @return string using projection
     */
    buildProjection: function (projection) {
        if (projection == null || projection.length == 0) {
            return "";
        }

        var columns = "\"columns\": [";
        var cols = "";
        _.each(projection, function (field) {
            cols += (cols.length == 0 ? "" : ", ") + "\"" + field + "\"";
        });

        return columns + cols + "]";
    },
    buildFieldsJson: function (data) {
        var json = JSON.stringify(data);
        var result = JSON.parse(json);

        $.each(data, function (key, value) {
            var array = '';
            if (typeof value === 'array' || value instanceof Array) {
                _.each(value, function (item) {
                    if (item != null) {
                        array = array + (array === '' ? '' : ',') + item.toString();
                    }
                });

                result[key] = array
            }
        });

        return JSON.stringify(result);
    },
    buildRecord: function (data) {
        var record = {};

        $.each(data, function (key, value) {
            if (typeof value === 'object') {
                $.each(value, function (k, v) {
                    if (typeof v === 'array' || v instanceof Array) {
                        var values = [];
                        _.each(v, function (item) {
                            if (item != null) {
                                values.push(item.toString())
                            }
                        });

                        record[key] = values;
                    } else {
                        record[key] = v
                    }

                    return -1
                });
            } else {
                record[key] = value
            }
        });

        return record;
    },
    getRecordList: function (data) {
        var recordList = [];

        var records = data['records'];

        _.each(records, function (jr, i, caller) {
            recordList.push(caller.buildRecord(jr));
        }, this);

        return recordList;
    },
    buildRecordResults: function (response) {
        var results = {};

        var json = typeof response == 'string' ? JSON.parse(response) : response;

        var data = json['records'];

        results['totalRecords'] = data['total'];
        results['fastReturnedSize'] = data['size'];
        results['records'] = this.getRecordList(data);

        return results;
    },
    normalizeRecord: function (record) {
        var normalized = {};

        $.each(record, function (key, value) {
            if (typeof value === 'object') {
                $.each(value, function (k, v) {
                    if (typeof v === 'array' || v instanceof Array) {
                        var values = [];
                        _.each(v, function (item) {
                            if (item != null) {
                                values.push(item.toString())
                            }
                        });

                        normalized[key] = values;
                    } else if (typeof v === 'string' || value instanceof String) {
                        normalized[key] = v.toString();
                    }

                    return -1
                });
            } else {
                normalized[key] = value;
            }
        });

        return normalized;
    }
};