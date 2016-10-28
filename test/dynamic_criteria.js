var assert = require('assert');
var dc = require('../app.js');
var helper = require('./helper.js');
var du = require('../utils/dynamic_utils');

helper.describe('Condition building process', function () {
    helper.it('Should build an equals condition', function () {
        var equalCondition = dc.conditions.equals('name', 'Eleazar').toRecordString();
        assert.equal(equalCondition, '"name" : "Eleazar"');

        equalCondition = dc.conditions.equals('age', 5).toRecordString();
        assert.equal(equalCondition, '"age" : 5');
    });

    helper.it('Should build an IN condition', function () {
        var condition = dc.conditions.isIn("age", [1, 2, 3]);
        assert.equal("\"age\": {\"$in\": [1,2,3]}", condition.toRecordString({}));

        condition = dc.conditions.isIn("age", ["1", "2", "3"]);
        assert.equal("\"age\": {\"$in\": [\"1\",\"2\",\"3\"]}", condition.toRecordString({}));

        condition = dc.conditions.isNotIn("age", [1, 2, 3]);
        assert.equal("\"age\": {\"$nin\": [1,2,3]}", condition.toRecordString({}));

        condition = dc.conditions.isNotIn("age", ["1", "2", "3"]);
        assert.equal("\"age\": {\"$nin\": [\"1\",\"2\",\"3\"]}", condition.toRecordString({}));

        condition = dc.conditions.isNotIn("age", ['1', '2', '3']);
        assert.equal("\"age\": {\"$nin\": [\"1\",\"2\",\"3\"]}", condition.toRecordString({}));
    });

    helper.it('Should build a greater, lesser, greaterEquals and lesserEquals conditions', function () {
        var equalCondition = dc.conditions.greaterThan('name', 'Eleazar').toRecordString();
        assert.equal(equalCondition, '"name": { "$gt": "Eleazar" }');

        equalCondition = dc.conditions.greaterEqualsThan('name', 'Eleazar').toRecordString();
        assert.equal(equalCondition, '"name": { "$gte": "Eleazar" }');

        equalCondition = dc.conditions.greaterEqualsThan('age', 5).toRecordString();
        assert.equal(equalCondition, '"age": { "$gte": 5 }');

        equalCondition = dc.conditions.lesserThan('age', 5).toRecordString();
        assert.equal(equalCondition, '"age": { "$lt": 5 }');

        equalCondition = dc.conditions.lesserEqualsThan('age', 5).toRecordString();
        assert.equal(equalCondition, '"age": { "$lte": 5 }');
    });

    helper.it('Should build a like condition', function () {
        var equalCondition = dc.conditions.greaterThan('name', 'Eleazar').toRecordString();
        assert.equal(equalCondition, '"name": { "$gt": "Eleazar" }');

        var condition = dc.conditions.like("name", "%eleazar%");
        assert.equal("\"name\": { \"$like\" : \"%eleazar%\" }", condition.toRecordString({}));

        condition = dc.conditions.notLike("name", "%eleazar%");
        assert.equal("\"name\": { \"$nlike\" : \"%eleazar%\" }", condition.toRecordString({}));
    });

    helper.it('Should build a notEquals condition', function () {
        var equalsCondition = dc.conditions.notEquals('name', 'Eleazar').toRecordString();
        assert.equal(equalsCondition, '"$ne" : {"name" : "Eleazar"}');

        equalsCondition = dc.conditions.notEquals("age", 4);
        assert.equal("\"$ne\" : {\"age\" : 4}", equalsCondition.toRecordString({}));
    });

    helper.it('Should build an is not null condition', function () {
        var condition = dc.conditions.isNull("name");
        assert.equal("\"name\": {\"$null\": \"1\"}", condition.toRecordString({}));

        condition = dc.conditions.isNotNull("name");
        assert.equal("\"name\": {\"$notNull\": \"1\"}", condition.toRecordString({}));
    });

    helper.it('Should build an OR condition', function () {
        var condition = dc.conditions.or(dc.conditions.isNull("name"), dc.conditions.isNotNull("name"));
        assert.equal("\"$or\": {\"name\": {\"$null\": \"1\"},\"name\": {\"$notNull\": \"1\"}}", condition.toRecordString({}));

        condition = dc.conditions.or(dc.conditions.isNull("name"), dc.conditions.like("name", "%eleazar%"));
        assert.equal("\"$or\": {\"name\": {\"$null\": \"1\"},\"name\": { \"$like\" : \"%eleazar%\" }}", condition.toRecordString({}));
    });

    helper.it('Should build an AND condition', function () {
        var condition = dc.conditions.and(dc.conditions.isNull("name"), dc.conditions.isNotNull("name"));
        assert.equal("\"name\": {\"$null\": \"1\"},\"name\": {\"$notNull\": \"1\"}", condition.toRecordString({}));

        condition = dc.conditions.and(dc.conditions.isNull("name"), dc.conditions.like("name", "%eleazar%"));
        assert.equal("\"name\": {\"$null\": \"1\"},\"name\": { \"$like\" : \"%eleazar%\" }", condition.toRecordString({}));
    });

    helper.it('Should build a group by clause', function () {
        var clause = dc.conditions.groupBy(["name", "age"]);
        assert.equal("\"groupBy\": [\"name\",\"age\"]", clause.toRecordString({}));
    });

    helper.it('Should build an order by clause', function () {
        var clause = dc.conditions.orderBy("name");

        assert.equal("name", clause.attribute);
        assert.equal(true, clause.asc);

        assert.equal("\"order\": \"name ASC\"", clause.toRecordString({}));

        clause.attribute = "lastname";
        clause.asc = false;

        assert.equal("lastname", clause.attribute);
        assert.equal(false, clause.asc);

        assert.equal("\"order\": \"lastname DESC\"", clause.toRecordString({}));
    });

    helper.it('Should build join clauses', function () {
        var modelId = 234;
        var join = dc.conditions.leftJoin(modelId, "user", "user.id = id");
        assert.equal("{ \"type\": \"left\", \"alias\": \"user\", \"target\": \"234\", \"on\": \"user.id = id\" }", join.toRecordString({}));

        join = dc.conditions.innerJoin(modelId, "user", "user.id like '%id%'");
        assert.equal("{ \"type\": \"inner\", \"alias\": \"user\", \"target\": \"234\", \"on\": \"user.id like '%id%'\" }", join.toRecordString({}));

        join = dc.conditions.innerJoin(modelId, "user", "user.id != id");
        assert.equal("{ \"type\": \"inner\", \"alias\": \"user\", \"target\": \"234\", \"on\": \"user.id != id\" }", join.toRecordString({}));

        join = dc.conditions.rightJoin(modelId, "user", "user.id != id");
        assert.equal("{ \"type\": \"right\", \"alias\": \"user\", \"target\": \"234\", \"on\": \"user.id != id\" }", join.toRecordString({}));
    });

    helper.it('Should build between condition', function () {
        var condition = dc.conditions.between("age", 20, 40);

        assert.equal("\"age\": { \"$between\": [20,40]}", condition.toRecordString({}));

        condition = dc.conditions.between("date", "2015-11-01 00:00:00", "2015-11-01 23:59:59");

        assert.equal("\"date\": { \"$between\": [\"2015-11-01 00:00:00\",\"2015-11-01 23:59:59\"]}", condition.toRecordString({}));
    });

    helper.it('Should build exists condition', function () {
        var modelId = 1455545;

        var condition = dc.conditions.exists(modelId, "inner");
        condition.add(dc.conditions.equals("inner.user_id", "vip.user_id"));

        assert.equal("\"$exists\": { \"joins\": [], \"model\": 1455545, \"alias\": \"inner\", \"where\": {\"inner.user_id\" : \"vip.user_id\"}}", condition.toRecordString({}));

        condition = dc.conditions.exists(modelId);
        condition.add(dc.conditions.equals("inner.user_id", "vip.user_id"));

        assert.equal("\"$exists\": { \"joins\": [], \"model\": 1455545, \"where\": {\"inner.user_id\" : \"vip.user_id\"}}", condition.toRecordString({}));

        condition = dc.conditions.exists();
        condition.add(dc.conditions.equals("inner.user_id", "vip.user_id"));

        assert.equal("\"$exists\": { \"joins\": [], \"where\": {\"inner.user_id\" : \"vip.user_id\"}}", condition.toRecordString({}));

        condition = dc.conditions.exists();
        condition.add(dc.conditions.equals("inner.user_id", "$vip.user_id$"));

        var innerCondition = dc.conditions.exists(54545, "inner2");
        innerCondition.add(dc.conditions.equals("inner2.user_id", "$vip2.user_id$"));

        condition.add(innerCondition);

        assert.equal("\"$exists\": { \"joins\": [], \"where\": {\"inner.user_id\" : \"$vip.user_id$\",\"$exists\": { \"joins\": [], \"model\": 54545, \"alias\": \"inner2\", \"where\": {\"inner2.user_id\" : \"$vip2.user_id$\"}}}}", condition.toRecordString({}));

        ///////

        condition = dc.conditions.notExists(modelId, "inner");
        condition.add(dc.conditions.equals("inner.user_id", "vip.user_id"));

        assert.equal("\"$nexists\": { \"joins\": [], \"model\": 1455545, \"alias\": \"inner\", \"where\": {\"inner.user_id\" : \"vip.user_id\"}}", condition.toRecordString({}));

        condition = dc.conditions.notExists(modelId);
        condition.add(dc.conditions.equals("inner.user_id", "vip.user_id"));

        assert.equal("\"$nexists\": { \"joins\": [], \"model\": 1455545, \"where\": {\"inner.user_id\" : \"vip.user_id\"}}", condition.toRecordString({}));

        condition = dc.conditions.notExists();
        condition.add(dc.conditions.equals("inner.user_id", "vip.user_id"));

        assert.equal("\"$nexists\": { \"joins\": [], \"where\": {\"inner.user_id\" : \"vip.user_id\"}}", condition.toRecordString({}));

        condition = dc.conditions.notExists();
        condition.add(dc.conditions.equals("inner.user_id", "$vip.user_id$"));

        innerCondition = dc.conditions.notExists(54545, "inner2");
        innerCondition.add(dc.conditions.equals("inner2.user_id", "$vip2.user_id$"));

        condition.add(innerCondition);

        assert.equal("\"$nexists\": { \"joins\": [], \"where\": {\"inner.user_id\" : \"$vip.user_id$\",\"$nexists\": { \"joins\": [], \"model\": 54545, \"alias\": \"inner2\", \"where\": {\"inner2.user_id\" : \"$vip2.user_id$\"}}}}", condition.toRecordString({}));
    });
});

helper.describe('DynamicloudUtil methods', function () {
    helper.it('Should build fields as json', function () {
        assert.equal('{"name":"Eleazar"}', du.buildFieldsJson({"name": "Eleazar"}));
        assert.equal('{"name":"Eleazar","last_name":"gomez"}', du.buildFieldsJson({
            'name': 'Eleazar',
            'last_name': 'gomez'
        }));
        assert.equal('{"name":"Eleazar","last_name":"gomez","hobbies":"1,2,3"}', du.buildFieldsJson({
            'name': 'Eleazar',
            'last_name': 'gomez',
            'hobbies': [1, 2, 3]
        }));
        assert.equal('{"name":"Eleazar","last_name":"gomez","hobbies":"1,2,3"}', du.buildFieldsJson({
            'name': 'Eleazar',
            'last_name': 'gomez',
            'hobbies': [1, null, 2, 3, null, null]
        }));
    });

    helper.it('Should build projection string', function () {
        assert.equal('"columns": ["name"]', du.buildProjection(['name']));
        assert.equal('"columns": ["count(name)"]', du.buildProjection(['count(name)']));
    });

    helper.it('Should build record', function () {
        var data = {
            'name': 'Eleazar',
            'last_name': 'gomez',
            'countries': {'value': ["us", "ve", "ca"], 'value02': 'dummy'}
        };

        assert.deepEqual({
            'countries': ["us", "ve", "ca"],
            'last_name': 'gomez',
            'name': 'Eleazar'
        }, du.buildRecord(data));
    });

    helper.it('Should build record list', function () {
        var data = {
            'records': [{
                'name': 'Eleazar',
                'last_name': 'gomez',
                'countries': {'value': ["us", "ve", "ca"], 'value02': 'dummy'}
            }]
        };

        assert.deepEqual([{
            'countries': ["us", "ve", "ca"],
            'last_name': 'gomez',
            'name': 'Eleazar'
        }], du.getRecordList(data));

        data = {
            'records': [
                {
                    'name': 'Eleazar',
                    'last_name': 'gomez',
                    'countries': {'value': ["us", "ve", "ca"], 'value02': 'dummy'}
                },
                {
                    'name': 'Enrique',
                    'last_name': 'gomez',
                    'countries': {'value': ["us", "ve", "ca"], 'value02': 'dummy'}
                }
            ]
        };

        var data2Test = [
            {'countries': ["us", "ve", "ca"], 'last_name': 'gomez', 'name': 'Eleazar'},
            {'countries': ["us", "ve", "ca"], 'last_name': 'gomez', 'name': 'Enrique'}
        ];

        assert.deepEqual(data2Test, du.getRecordList(data));
    });

    helper.it('Should build record results', function () {
        var response = '{"records": {"total": 12, "size": 3, "records": [{"name": "eleazar"}, {"name": "enrique"}, {"name": "eleana"}]}}';
        var recordResults = du.buildRecordResults(response);

        assert.equal(3, recordResults.fastReturnedSize);
        assert.equal(12, recordResults.totalRecords);
        assert.equal(3, recordResults.records.length);

        assert.deepEqual([{'name': 'eleazar'}, {'name': 'enrique'}, {'name': 'eleana'}], recordResults.records)
    });

    helper.it('Should normalize record', function () {
        var record = record = {'name': 'Eleazar'};
        assert.deepEqual({'name': 'Eleazar'}, du.normalizeRecord(record));

        record = {'name': 'Eleazar', 'last_name': 'gomez'};
        assert.deepEqual({'last_name': 'gomez', 'name': 'Eleazar'}, du.normalizeRecord(record));

        record = {
            'name': 'Eleazar',
            'last_name': 'gomez',
            'countries': {'value': ["us", "ve", "ca"], 'value02': 'dummy'}
        };

        assert.deepEqual({
            'countries': ["us", "ve", "ca"],
            'last_name': 'gomez',
            'name': 'Eleazar'
        }, du.normalizeRecord(record));

        record = {'name': 'Eleazar', 'last_name': 'gomez', 'country': {'value': 'us'}};
        assert.deepEqual({'country': 'us', 'last_name': 'gomez', 'name': 'Eleazar'}, du.normalizeRecord(record));
    });

    helper.it('Should build join tags', function () {
        var modelId = 324;

        assert.equal("\"joins\": []", du.buildJoinTag(null));

        assert.equal("\"joins\": []", du.buildJoinTag([]));

        var joins = [];

        joins.push(dc.conditions.leftJoin(modelId, "user", "user.id = id"));

        assert.equal("\"joins\": [{ \"type\": \"left\", \"alias\": \"user\", \"target\": \"324\", \"on\": \"user.id = id\" }]", du.buildJoinTag(joins));

        var modelId2 = 325;

        joins.push(dc.conditions.innerJoin(modelId2, "countries", "user.id = id"));

        assert.equal("\"joins\": [{ \"type\": \"left\", \"alias\": \"user\", \"target\": \"324\", \"on\": \"user.id = id\" }, { \"type\": \"inner\", \"alias\": \"countries\", \"target\": \"325\", \"on\": \"user.id = id\" }]", du.buildJoinTag(joins));

        joins = [];

        joins.push(dc.conditions.leftOuterJoin(modelId2, "user", "user.id = languages.id"));

        assert.equal("\"joins\": [{ \"type\": \"left outer\", \"alias\": \"user\", \"target\": \"325\", \"on\": \"user.id = languages.id\" }]", du.buildJoinTag(joins));

        joins = [];

        joins.push(dc.conditions.rightOuterJoin(modelId2, "user", "user.id = languages.id"));

        assert.equal("\"joins\": [{ \"type\": \"right outer\", \"alias\": \"user\", \"target\": \"325\", \"on\": \"user.id = languages.id\" }]", du.buildJoinTag(joins));
    });
});