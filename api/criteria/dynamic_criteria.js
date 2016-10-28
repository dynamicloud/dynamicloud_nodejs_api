"use strict";

var conditionFactory = require('./query_condition.js');

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
 * This module has the necessary functions to execute conditions to retrieve records.
 *
 * @author Eleazar Gomez
 */

/**
 * This is a singleton class to provide condition methods
 */
var Conditions = {
    /**
     * It will build an and condition using two parts (Left and Right)
     *
     * @param left  left part of and
     * @param right right part of and
     * @return A built condition
     */
    and: function (left, right) {
        return conditionFactory.ANDCondition(left, right);
    },
    /**
     * It will build an or condition using two parts (Left and Right)
     *
     * @param left  left part of or
     * @param right right part of or
     * @return A built condition.
     */
    or: function (left, right) {
        return conditionFactory.ORCondition(left, right);
    },
    /**
     * It will build a like condition.
     *
     * @param left attribute to comapare
     * @param like String to use for like condition
     * @return a built condition.
     */
    like: function (left, like) {
        return conditionFactory.like(left, like, false);
    },
    /**
     * It will build a not like condition.
     *
     * @param left attribute to compare
     * @param like String to use for like condition
     * @return a built condition.
     */
    notLike: function (left, like) {
        return conditionFactory.like(left, like, true);
    },
    /**
     * It will an in condition using an array of values.
     *
     * @param left   attribute to compare
     * @param array string values to build IN condition
     * @return a built condition.
     */
    isIn: function (left, array) {
        return conditionFactory.isIn(left, array, false);
    },
    /**
     * It will an in condition using an array of values.
     *
     * @param left   attribute to compare
     * @param array string values to build IN condition
     * @return a built condition.
     */
    isNotIn: function (left, array) {
        return conditionFactory.isIn(left, array, true);
    },
    /**
     * It will build an equals condition.
     *
     * @param left  attribute to compare
     * @param right right part of this condition
     * @return a built condition.
     */
    equals: function (left, right) {
        return conditionFactory.equals(left, right, '-');
    },
    /**
     * It will build a greater equals condition.
     *
     * @param left  attribute to compare
     * @param right right part of this condition
     * @return a built condition.
     */
    greaterEqualsThan: function (left, right) {
        return conditionFactory.equals(left, right, '>');
    },
    /**
     * It will build a lesser equals condition.
     *
     * @param left  attribute to compare
     * @param right right part of this condition
     * @return a built condition.
     */
    lesserEqualsThan: function (left, right) {
        return conditionFactory.equals(left, right, '<');
    },
    /**
     * It will build a not equals condition.
     *
     * @param left  attribute to compare
     * @param right right part of this condition
     * @return a built condition.
     */
    notEquals: function (left, right) {
        return conditionFactory.notEquals(left, right);
    },
    /**
     * Creates a new instance of ExistsCondition
     *
     * @param modelId model Id
     * @param alias alias to this model (optional)
     * @return a new instance of ExistsCondition
     */
    exists: function (modelId, alias) {
        return conditionFactory.exists(modelId, alias, false);
    },
    /**
     * Creates a new instance of ExistsCondition
     *
     * @param modelId model Id
     * @param alias alias to this model (optional)
     * @return a new instance of ExistsCondition
     */
    notExists: function (modelId, alias) {
        return conditionFactory.exists(modelId, alias, true);
    },
    /**
     *
     * @param field field to use
     * @param left part of a range
     * @param right part of a range
     * @returns between condition
     */
    between: function (field, left, right) {
        return conditionFactory.between(field, left, right);
    },
    /**
     * It will build a is null condition
     *
     * @param left attribute to compare
     * @return a built condition
     */
    isNull: function (left) {
        return conditionFactory.isNull(left, false);
    },
    /**
     * It will build a is null condition
     *
     * @param left attribute to compare
     * @return a built condition
     */
    isNotNull: function (left) {
        return conditionFactory.isNull(left, true);
    },
    /**
     * It will build a greater than condition.
     *
     * @param left  attribute to compare
     * @param right right part of this condition
     * @return a built condition.
     */
    greaterThan: function (left, right) {
        return conditionFactory.greaterLesser(left, right, '>');
    },
    /**
     * It will build a greater than condition.
     *
     * @param left  attribute to compare
     * @param right right part of this condition
     * @return a built condition.
     */
    lesserThan: function (left, right) {
        return conditionFactory.greaterLesser(left, right, '<');
    },
    /**
     * Builds a left join clause.
     *
     * @param modelId         target model of this join
     * @param alias         attached alias to this target model
     * @param condition on condition of this join clause
     * @return a Join Clause as a condition
     */
    leftJoin: function (modelId, alias, condition) {
        return conditionFactory.leftJoin(modelId, alias, condition);
    },
    /**
     * Builds a left outer join clause.
     *
     * @param modelId         target model of this join
     * @param alias         attached alias to this target model
     * @param condition on condition of this join clause
     * @return a Join Clause as a condition
     */
    leftOuterJoin: function (modelId, alias, condition) {
        return conditionFactory.leftOuterJoin(modelId, alias, condition);
    },
    /**
     * Builds a rightjoin clause.
     *
     * @param modelId         target model of this join
     * @param alias         attached alias to this target model
     * @param condition on condition of this join clause
     * @return a Join Clause as a condition
     */
    rightJoin: function (modelId, alias, condition) {
        return conditionFactory.rightJoin(modelId, alias, condition);
    },
    /**
     * Builds a right outer join clause.
     *
     * @param modelId         target model of this join
     * @param alias         attached alias to this target model
     * @param condition on condition of this join clause
     * @return a Join Clause as a condition
     */
    rightOuterJoin: function (modelId, alias, condition) {
        return conditionFactory.rightOuterJoin(modelId, alias, condition);
    },
    /**
     * Builds a inner join clause.
     *
     * @param modelId         target model of this join
     * @param alias         attached alias to this target model
     * @param condition on condition of this join clause
     * @return a Join Clause as a condition
     */
    innerJoin: function (modelId, alias, condition) {
        return conditionFactory.innerJoin(modelId, alias, condition);
    },
    groupBy: function (attributes) {
        return conditionFactory.groupBy(attributes);
    },
    orderBy: function (attribute) {
        return conditionFactory.orderBy(attribute);
    }
};

var conditions = Object.create(Conditions);
module.exports = {
    getConditionInstance: function () {
        return conditions;
    }
};