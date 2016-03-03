"use strict";

var _ = require('../../utils/array_utils.js');
var du = require('../../utils/dynamic_utils.js');

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
 * This module has the necessary functions to build query conditions.
 *
 * @author Eleazar Gomez
 */

var LEFT_JOIN = 'left';
var LEFT_OUTER_JOIN = "left outer";
var RIGHT_JOIN = "right";
var RIGHT_OUTER_JOIN = "right outer";
var INNER_JOIN = "inner";

/**
 * Builds general left and right parts
 * @param left part
 * @param right part
 * @returns {{left: {value: *, writable: boolean}, right: {value: *, writable: boolean}}}
 */
function buildGeneralLetPartProperties(left, right) {
    return {
        'left': {
            value: left,
            writable: false //Avoid changes after this initialization.
        },
        'right': {
            value: right,
            writable: false //Avoid changes after this initialization.
        }
    };
}

function globalJoinProperties(joinType, modelId, alias, joinCondition) {
    return {
        'joinType': {
            value: joinType,
            writable: false //Avoid changes after this initialization.
        },
        'modelId': {
            value: modelId,
            writable: false //Avoid changes after this initialization.
        },
        'alias': {
            value: alias,
            writable: false //Avoid changes after this initialization.
        },
        'joinCondition': {
            value: joinCondition,
            writable: false //Avoid changes after this initialization.
        }
    };
}

module.exports = {
    ANDCondition: function (left, right) {
        return Object.create(ANDCondition, buildGeneralLetPartProperties(left, right));
    },
    ORCondition: function (left, right) {
        return Object.create(ORCondition, buildGeneralLetPartProperties(left, right));
    },
    like: function (left, right, notLike) {
        var props = buildGeneralLetPartProperties(left, right);
        props['notLike'] = {
            value: notLike,
            writable: false //Avoid changes after this initialization.
        };

        return Object.create(LikeCondition, props);
    },
    isIn: function (left, array, notIn) {
        var props = {
            'left': {
                value: left,
                writable: false //Avoid changes after this initialization.
            },
            'notIn': {
                value: notIn,
                writable: false //Avoid changes after this initialization.
            },
            'values': {
                value: array,
                writable: false //Avoid changes after this initialization.
            }
        };

        return Object.create(IsInCondition, props);
    },
    equals: function (left, right, greaterLesser) {
        var props = buildGeneralLetPartProperties(left, right);
        props['greaterLesser'] = {
            value: greaterLesser,
            writable: false //Avoid changes after this initialization.
        };

        return Object.create(Equals, props);
    },
    notEquals: function (left, right) {
        return Object.create(NotEquals, buildGeneralLetPartProperties(left, right));
    },
    exists: function (modelId, alias, notExists) {
        var props = {
            'notExists': {
                value: notExists,
                writable: false //Avoid changes after this initialization.
            },
            'alias': {
                value: alias,
                writable: false //Avoid changes after this initialization.
            },
            'modelId': {
                value: modelId,
                writable: false //Avoid changes after this initialization.
            },
            'join': {
                value: [],
                writable: true
            },
            'conditions': {
                value: [],
                writable: true
            }
        };

        return Object.create(Exists, props);
    },
    isNull: function (left, notNull) {
        var props = {
            'notNull': {
                value: notNull,
                writable: false //Avoid changes after this initialization.
            },
            'left': {
                value: left,
                writable: false //Avoid changes after this initialization.
            }
        };

        return Object.create(IsNull, props);
    },
    between: function (field, left, right) {
        var props = {
            'field': {
                value: field,
                writable: false //Avoid changes after this initialization.
            },
            'left': {
                value: left,
                writable: false //Avoid changes after this initialization.
            },
            'right': {
                value: right,
                writable: false //Avoid changes after this initialization.
            }
        };

        return Object.create(Between, props);
    },
    greaterLesser: function (left, right, greaterLesser) {
        var props = buildGeneralLetPartProperties(left, right);
        props['greaterLesser'] = {
            value: greaterLesser,
            writable: false //Avoid changes after this initialization.
        };

        return Object.create(GreaterLesser, props);
    },
    leftJoin: function (modelId, alias, joinCondition) {
        var props = globalJoinProperties(LEFT_JOIN, modelId, alias, joinCondition);
        return Object.create(JoinClause, props);
    },
    leftOuterJoin: function (modelId, alias, joinCondition) {
        var props = globalJoinProperties(LEFT_OUTER_JOIN, modelId, alias, joinCondition);
        return Object.create(JoinClause, props);
    },
    rightJoin: function (modelId, alias, joinCondition) {
        var props = globalJoinProperties(RIGHT_JOIN, modelId, alias, joinCondition);
        return Object.create(JoinClause, props);
    },
    rightOuterJoin: function (modelId, alias, joinCondition) {
        var props = globalJoinProperties(RIGHT_OUTER_JOIN, modelId, alias, joinCondition);
        return Object.create(JoinClause, props);
    },
    innerJoin: function (modelId, alias, joinCondition) {
        var props = globalJoinProperties(INNER_JOIN, modelId, alias, joinCondition);
        return Object.create(JoinClause, props);
    },
    groupBy: function (attributes) {
        var props = {
            'attributes': {
                value: attributes,
                writable: false
            }
        };

        return Object.create(GroupByClause, props);
    },
    orderBy: function (attribute) {
        var props = {
            'attribute': {
                value: attribute,
                writable: true
            },
            'asc': {
                value: true,
                writable: true
            }
        };

        return Object.create(OrderByClause, props);
    }
};

var ANDCondition = {
    objectName: 'ANDCondition',
    /**
     * This method will return a String of this condition
     * @param parent this is the parent of this condition
     * @return string json
     */
    toRecordString: function (parent) {
        return (parent.objectName === 'ORCondition' ? "\"where\": {" : "") + this.left.toRecordString(this) + "," +
            this.right.toRecordString(this) + (parent.objectName === 'ORCondition' ? "}" : "");
    }
};

var ORCondition = {
    objectName: 'ORCondition',
    /**
     * This method will return a String of this condition
     * @param parent this is the parent of this condition
     * @return string json
     */
    toRecordString: function (parent) {
        return (parent.objectName === 'ORCondition' ? "" : "\"$or\": {") + this.left.toRecordString(this) + "," +
            this.right.toRecordString(this) + (parent.objectName === 'ORCondition' ? "" : "}");
    }
};

var LikeCondition = {
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        return "\"" + this.left + "\": { \"$" + (this.notLike ? "n" : "") + "like\" : " + "\"" + this.right + "\"" + " }";
    }
};

var IsInCondition = {
    /**
     * This method will return a String of this condition
     * @param parent this is the parent of this condition
     * @return string json
     */
    toRecordString: function (parent) {
        var condition = "\"" + this.left + "\": {" + (this.notIn ? "\"$nin\"" : "\"$in\"") + ": [";
        var items = "";

        _.each(this.values, function (value) {
            items += (items.length == 0 ? "" : ",") + ((typeof value) === 'string' || value instanceof String ? "\"" : "") + value + ((typeof value) === 'string' || value instanceof String ? "\"" : "");
        });

        return condition + items + "]}";
    }
};

var Equals = {
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        var needQuotes = (typeof this.right) === 'string' || this.right instanceof String;

        if (this.greaterLesser == '-') {
            return "\"" + this.left + "\" : " + (needQuotes ? "\"" : "") + this.right.toString() + (needQuotes ? "\"" : "");
        }

        return "\"" + this.left + "\": { " + (this.greaterLesser == '>' ? "\"$gte\": " : "\"$lte\": ") +
            (needQuotes ? "\"" : "") + this.right.toString() + (needQuotes ? "\"" : "") + " }";
    }
};

var NotEquals = {
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        return "\"$ne\" : {\"" + this.left + "\" : " + ((typeof this.right) === 'string' || this.right instanceof String ? "\"" : "") + this.right +
            ((typeof this.right) === 'string' || this.right instanceof String ? "\"" : "") + "}";
    }
};

var Exists = {
    /**
     * This method will add a new condition to this ExistsCondition.
     *
     * @param condition new condition to an array of conditions to use
     * @return Exists instance
     */
    add: function (condition) {
        this.conditions.push(condition);

        return this;
    },
    /**
     * Add a join to the array of joins
     *
     * @param join join clause
     * @return Exists instance
     */
    join: function (join) {
        this.joins.push(join);

        return this;
    },
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        var built = (this.notExists ? "\"$nexists\"" : "\"$exists\"") + ": { " + du.buildJoinTag(this.joins) + ", " +
            (this.modelId == null ? "" : ("\"model\": " + this.modelId + ", ")) + (this.alias == null ? "" : ("\"alias\": \"" + this.alias + "\", ")) +
            "\"where\": {";

        if (this.conditions.length > 0) {
            var global = this.conditions[0];

            if (this.conditions.length > 1) {
                var newConditions = _.subArray(this.conditions, 1);

                _.each(newConditions, function (condition) {
                    global = Object.create(ANDCondition, buildGeneralLetPartProperties(global, condition));
                });
            }

            built += global.toRecordString({});
        }

        return built + "}}";
    }
};

var Between = {
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        return "\"" + this.field + "\": { \"$between\": [" + (this.transformLeftRight()) + "]}";
    },

    transformLeftRight: function () {
        var result = ((typeof this.left) === 'string' || this.left instanceof String ? ("\"" + this.left + "\"") : this.left.toString());
        result += ",";

        return result + ((typeof this.right) === 'string' || this.right instanceof String ? ("\"" + this.right + "\"") : this.right.toString());
    }
};

var IsNull = {
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        return "\"" + this.left + "\": {" + (this.notNull ? "\"$notNull\"" : "\"$null\"") + ": \"1\"}";
    }
};

var GreaterLesser = {
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        var needQuotes = (typeof this.right) === 'string' || this.right instanceof String;

        return "\"" + this.left + "\": { " + (this.greaterLesser == '>' ? "\"$gt\"" : "\"$lt\"") + ": " +
            (needQuotes ? "\"" : "") + this.right.toString() + (needQuotes ? "\"" : "") + " }";
    }
};

var JoinClause = {
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        return "{ \"type\": \"" + this.joinType + "\", \"alias\": \"" + this.alias + "\", \"target\": \"" + this.modelId + "\", \"on\": \"" + this.joinCondition + "\" }";
    }
};

var GroupByClause = {
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        var groupBy = "\"groupBy\": [";

        var attrs = "";
        _.each(this.attributes, function (attr) {
            attrs += (attrs.length == 0 ? "" : ",") + "\"" + attr + "\"";
        });

        return groupBy + attrs + "]";
    }
};

var OrderByClause = {
    /**
     * This method will return a String of this condition
     * @return string json
     */
    toRecordString: function () {
        return "\"order\": \"" + this.attribute + (this.asc ? " ASC" : " DESC") + "\"";
    }
};