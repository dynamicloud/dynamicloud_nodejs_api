var assert = require('assert');
var helper = require('./helper.js');
var dc = require('../src/app.js');

helper.describe('Dynamic API', function () {
    const modelId = 980190988;

    const provider = dc.buildProvider({
        csk: 'csk#5c6f68d48ff4905a80d396a465580d34fc6e8fa2',
        aci: 'aci#81969f0abe4d15d4304411e65c6557e64b3b6576'
    });

    helper.it('Should execute exists condition', function () {
        var query = provider.createQuery(modelId);
        query.alias = 'o';

        var existsCondition = dc.conditions.exists(modelId, 'i');
        existsCondition.add(dc.conditions.equals('o.id', '$i.id$'));

        query.add(existsCondition).orderBy("o.id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute and condition', function () {
        var query = provider.createQuery(modelId);

        query.add(dc.conditions.and(dc.conditions.isIn("id", [1, 5, 83, 25, 101, 96, 88]),
            dc.conditions.between("id ", 88, 101))).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute or condition', function () {
        var query = provider.createQuery(modelId);

        query.add(dc.conditions.or(dc.conditions.isIn("id", [1, 5, 83, 25, 101, 96, 88]),
            dc.conditions.between("id ", 88, 101))).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
        });
    });

    helper.it('Should execute equals condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.equals("id", 75)).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute not equals condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.notEquals("id", 75)).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute greater than condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.greaterThan("id", 75)).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute greater equals than condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.greaterEqualsThan("id", 75)).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute lesser than condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.lesserThan("id", 75)).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute lesser equals than condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.lesserEqualsThan("id", 75)).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute is in condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.isIn("id", [75])).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute is not in condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.isNotIn("id", [75])).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute like condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.like("lonlinetext", "%app%")).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute not like condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.notLike("lonlinetext", "%app%")).orderBy("id").desc();

        query.getResults(function (error, results) {
            assert.equal(null, error);
        });
    });

    helper.it('Should execute between condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.between("id", 50, 100)).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute null condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.isNull("id")).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should execute not null condition', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.isNotNull("id")).orderBy("id").desc();

        query.getResults(function (error, results) {
            console.log(results);
            assert.equal(null, error);
        });
    });

    helper.it('Should load record', function () {
        provider.loadRecord(141, modelId, function (error, record) {
            console.log(record.lonlinetext);
            assert.equal(null, error);
        });
    });

    helper.it('Should load record', function () {
        provider.saveRecord(modelId, {
            'lonlinetext': 'testing',
            'lonlinelevel': 'debug'
        }, function (error, record) {
            console.log(record.lonlinetext);
            assert.equal(null, error);

            helper.it('Should delete record', function () {
                record.lonlinetext = 'Testing update';

                provider.updateRecord(modelId, record,
                    function (error, record) {
                        assert.equal(null, error);

                        helper.it('Should delete record', function () {
                            provider.deleteRecord(modelId, record['rid'],
                                function (error, record) {
                                    assert.equal(null, error);
                                });
                        });
                    });
            });
        });
    });

    helper.it('Should load model', function () {
        provider.loadModel(modelId, function (error, model) {
            console.log(model);
            assert.equal(null, error);
        });
    });

    helper.it('Should load models', function () {
        provider.loadModels(function (error, models) {
            console.log(models);
            assert.equal(null, error);
        });
    });

    helper.it('Should load fields', function () {
        provider.loadFields(modelId, function (error, fields) {
            console.log(fields);
            assert.equal(null, error);
        });
    });

    helper.it('Should update with selection', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.equals("id", 75));

        provider.updateWithSelection(query, {
            'lonlinetext': 'Update with selection'
        }, function (error) {
            assert.equal(null, error);
        });
    });

    helper.it('Should update with selection', function () {
        var query = provider.createQuery(modelId);
        query.add(dc.conditions.equals("id", -75));

        provider.deleteWithSelection(query, function (error) {
            assert.equal(null, error);
        });
    });
});