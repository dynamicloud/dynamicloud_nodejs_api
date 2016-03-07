# Dynamicloud NodeJs API v1.0.5
This NodeJs API helps you to use the power of Dynamicloud.  This API follows our Rest documentation to execute CRUD operations according to http methods.

#Requirements

NodeJs v4.1.0 or later, you can download it on [NodeJs site](https://nodejs.org/en/download/ "Download NodeJs")

#Installation

You can install this module in your system using the npm command:
 
`npm install dynamicloud`

#NodeJs documentation

To read the NodeJs API documentation click [here](https://www.npmjs.com/package/dynamicloud "Dynamicloud NodeJs API documentation")

# Getting started

This API provides components to execute operations on [Dynamicloud](http://www.dynamicloud.org/ "Dynamicloud") servers.  The main components and function are the followings:

1. [Model](#model)
2. [Credential](#credential)
3. [DynamicProvider](#dynamicprovider)
  1. [DynamicProvider's function](#functions)
4. [Query](#query-object)
  1. [Results](#results)
  - [Condition](#conditions-object)
  - [Conditions](#conditions-object)
  - [Between condition](#between-condition)
  - [Exists condition](#exists-condition)
  - [Join clause](#join-clause)
  - [Next, Offset and Count functions](#next-offset-and-count-functions)
  - [Order by](#order-by)
  - [Group by and Projection](#group-by-and-projection)
  - [Functions as a Projection](#functions-as-a-projection)
5. [Update using selection](#update-using-selection)
6. [Delete using selection](#delete-using-selection)

These components will allow you to connect on Dynamicloud servers, authenticate and execute operations like *loadRecord*, *updateRecord*, *deleteRecord*, *get record's information according to selection*, *get record's information according to projection*, etc.  The next step is explain every components and how to execute operations.  

# Model

To load records in this API you're going to use a `Model Id`.  Every record belongs to a Model.

#Credential

To gain access in Dynamicloud servers you need to provide the API keys.  These APIs ware provided at moment of your registration.

#DynamicProvider
`DynamicProvider` provides important functions and can be used as follow:
```javascript
var dc = require('dynamicloud');

var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});
```
 
**First, let's explain the initialization function:**
 ```javascript
function buildProvider(credentialObject)
 ```
This function receives an object with the credential to gain access.  The credential object is composed by Client Secret Key (CSK) and Application Client ID (ACI), these keys were provided at moment of your registration.
 
#Functions
 
 **Load Record**
```javascript
/**
 * This function will load a record using recordId.
 *
 * @param recordId        record id
 * @param modelId        model id
 *
 * @return a json object with the data from Dynamicloud
 * @param callback this callback will be called when response it's available.
 */
loadRecord: function (recordId, modelId, callback)
```
This function loads a record according to rid *(RecordID)* in model *(ModelID)*.

**For example, a call of this function would be:**
 ```javascript
provider.loadRecord(141, modelId, function (error, record) {
    /**
    * If error is null then everything went wel, otherwise an error was thrown.
    */
    console.log(record);
});
```

**Save Record**
 ```javascript
/**
 * This function saves a record into Dynamicloud
 * @param modelId model target
 * @param record record object that will be saved
 *
 * @return the record Id of this new record
 * @param callback this callback will be called when response it's available.  This callback function receives the record with the rid attribute
 */
saveRecord: function (modelId, record, callback)
```
This function saves a record (Object) using the data within it.

**For example, a call of this function would be:**
 ```javascript
provider.saveRecord(modelId, {
    'lonlinetext': 'testing',
    'lonlinelevel': 'debug'
}, function (error, record) {
  // This function will have the record id in Dynamicloud
  console.log(record.rid);
}):
```

**Update Record**
 ```javascript
/**
 * This function will call an update operation in Dynamicloud servers
 * using model and BoundInstance object
 *
 * @param modelId    modelId
 * @param record object that will be saved
 * @param callback this callback will be called when response it's available.
 */
updateRecord: function (modelId, record, callback)
```
This function updates the record (record['rid'])

**For example, a call of this function would be:**
 ```javascript
provider.updateRecord(modelId, record, function (error, record) {
  console.log('Updated record = ' + record['rid']);
}):
```

**Delete Record**
 ```javascript
/**
 * This function will call a delete operation in Dynamicloud servers
 * using model and Record id
 *
 * @param modelId model Id
 * @param recordId   record id
 * @param callback this callback will be called when response it's available.
 */
deleteRecord: function (modelId, recordId, callback)
```
This function deletes a record from the Model

**For example, a call of this function would be:**
 ```javascript
provider.deleteRecord(modelId, record['rid'], function (error, record) {
  console.log('Deleted record = ' + record['rid']);
});
```

**Create query**
 ```javascript
/**
 * Will create a Query using the credentials of this provider.
 *
 * @param modelId to execute operations
 * @return query instance
 */
createQuery: function (modelId)
```
This function returns a Query to get records according to a specific selection.

**For example, a call of this function would be:**
 ```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);

```

#Query object

This object provides a set of functions to add conditions, order by and group by clauses, projections, etc.

```javascript
function add(condition);
function join(condition);
function asc();
function desc();
alias=
count=
offset=
function orderBy(attribute);
function groupBy(attributes)
function getResults(callback);
function getResultsByProjection(projection, callback);
function next(callback);
```

With the Query object we can add conditions like EQUALS, IN, OR, AND, GREATER THAN, LESSER THAN, etc.  The query object is mutable and every call of its functions will return the same instance.

#Results

**This object provides three attributes:**
- `totalRecords` The total records in Model
- `fastReturnedSize` The returned size of records that have matched with Query conditions
- `records` An array of records.

**The uses of this class would be as a follow:**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);
query.add(dc.conditions.like("name", "Eleaz%"));

/**
* This function will call getResultsByProjection(null, callback)
*/
query.getResults(function(error, results) {
  _.each(results.records, function(item) {
      var email = item.getEmail();
  });
});
```

#Conditions object

This object provides a set of functions to build conditions and add them to the query object
```javascript
function and(left, right);
function or(left, right);
function isIn(left, values);
function isNotIn(left, values);
function like(left, like);
function notLike(left, like);
function equals(left, right);
function between(field, Object left, Object right);
function exists();
function notExists();
function notEquals(left, Object right);
function greaterEqualsThan(left, Object right);
function greaterThan(left, Object right);
function lesserThan(left, Object right);
function lesserEqualsThan(left, Object right);
function leftJoin(modelId, alias, Condition);
function leftOuterJoin(modelId, alias, Condition);
function rightJoin(modelId, alias, Condition);
function rightOuterJoin(modelId, alias, Condition);
function innerJoin(modelId, alias, Condition);
```

To add conditions to a Query object it must call the add function `(query.add(condition))`

**For example:**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);
query.add(dc.conditions.like("name", "Eleaz%"));
```

Every call of add function in object Query will put the Condition in a ordered array of conditions, that array will be joint as a AND condition.  So, if you add two conditions as follow:

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);
query.add(dc.conditions.like("name", "Eleaz%"));
 
query.add(dc.conditions.like("name", "Eleaz%")).add(dc.conditions..equals("age", 33));
```

These two calls of add function will produce something like this:

`name like 'Eleazar%' AND age = 33`

Query object provides a function called `getResultsWithProjection(projection, callback)`, this function will execute a request using the *ModelId* and *Conditions*. The response from Dynamicloud will be encapsulated in a javascript object.

#Between condition

With this condition you can build selections like `age between 24 and 30` or `birthdate bewteen '2010-01-01 00:00:00' and '2015-11-01 23:59:59'`.

**A Between condition is composed by: field's identifier and an interval (left and right)**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);
query.add(dc.conditions.between("agefield", 20, 25));

query.getResults(function(error, results) {
  console.log(results.records);
});
.
.
.
```

**Using dates:**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);
query.add(dc.conditions.between("birthdate", "2010-01-01 00:00:00", "2015-11-01 23:59:59"));

query.getResults(function(error, results) {
  console.log(results.records);
});
.
.
.
```

#Exists condition

Exists condition is a way to execute correlated queries and get results if a specific condition is true.  For example, imagine the following SQL query:

```sql
-- Here we want to get the VIP users
SELECT * FROM users u WHERE EXISTS (SELECT * FROM vip_users v WHERE v.user_id = u.id)
```

**Let's do it using Dynamicloud's library:**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);

/**
* This is the alias to recordModel, this alias is necessary if you need to execute an exists using two models
*/
query.alias = "u";

var exists = dc.conditions.exists(vipmodel, "v");

/**
* The dollar symbols are to avoid to use right part as a String, but literally v.user_id = u.id
*/
exists.add(dc.conditions.equals("v.user_id", "$u.id$"));

query.add(exists);

query.getResults(function(error, results) {
  console.log(results.records);
});
.
.
.
```

**If you want to get the users without vip label:**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);

/**
* This is the alias to recordModel, this alias is necessary if you need to execute an exists using two models
*/
query.alias = "u";

var exists = dc.conditions.notExists(vipmodel, "v");

/**
* The dollar symbols are to avoid to use right part as a String, but literally v.user_id = u.id
*/
exists.add(dc.conditions.equals("v.user_id", "$u.id$"));

query.add(exists);

query.getResults(function(error, results) {
  console.log(results.records);
});
```

**Another capability in Exists condition is the JoinClauses to execute correlated queries with Joins, for example:**
```sql
SELECT * FROM users u WHERE EXISTS (SELECT * FROM vip_users v JOIN vip_country c ON c.vip_id = v.id WHERE v.user_id = u.id AND c.country_iso = 'BR')
```

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);

/**
* This is the alias to recordModel, this alias is necessary if you need to execute an exists using two models
*/
query.alias = "u";

var exists = Conditions.exists(vipmodel, "v");

exists.join(dc.conditions.innerJoin(countryModel, "c", "c.vip_id = v.id") /*This is the ON condition*/);

/**
* The dollar symbols are to avoid to use right part as a String, but literally v.user_id = u.id
*/
exists.add(dc.conditions.and(dc.conditions.equals("v.user_id", "$u.id$"), dc.conditions.equals("c.country_iso", "BR")));

query.add(exists);

query.getResults(function(error, results) {
  console.log(results.records);
});
```

#Join Clause

With Join Clause you can execute conditions and involve more than one model.  This is useful in situations when you need to compare data between two or more models and get information in one execution.

**A Join Clause is composed by: Model, Type, Alias and ON condition:**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

/**
* Query has the main model 'user'
*/
var query = provider.createQuery(modelId);

/**
 * This is the alias to recordModel, this alias is necessary to use JoinClause
 */
query.alias = "user";

/**
* This is the model 'languages' to join with model 'user'
*/
languagesRecordModel = 123;

/**
* Conditions class provides: innerJoin, leftJoin, rightJoin, leftOuterJoin and rightOuterJoin.
* If you need to add more than one join, you have to call query.join(...) and will be added in the query join array.
*
* This is an example to get the count of languages of every user.
*/
query.join(dc.conditions.innerJoin(languagesRecordModel, "lang", "user.id = lang.userid"));

/**
* The Join Clause could be executed using a selection
*/
query.add(dc.conditions.greaterThan("user.age", 25));

/**
* You can group the results to use sum, count, avg, etc.
*/
query.groupBy("user.id");

query.getResultsWithProjection(["user.id as userid", "count(1) as count"], function(error, results) {
  console.log(results.records);
});
```

#Next, Offset and Count functions

Query object provides a function to walk across the records of a Model.  Imagine a model with a thousand of records, obviously you shouldn't load the whole set of records, you need to find a way to load a sub-set by demand.

The function to meet this goal is `next`.  Basically, the next function will increase the offset automatically and will execute the request with the previous conditions. By default, offset and count will have 0 and 15 respectively.

**The uses of this function would be as follow:**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(model);
query.add(dc.conditions.like("name", "Eleaz%")).add(dc.conditions.equals("age", 33));

query.getResults(function(error, results) {
  console.log(results.records);
  
  query.next(function(error, results) {
    console.log(results.records);
  });
});
```

If you want to set an `offset` or `count`, follow this guideline:

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(model);
query.add(dc.conditions.like("name", "Eleaz%")).add(dc.conditions.equals("age", 33));

//Every call will fetch max 10 records and will start from eleventh record.
query.count = 10;
query.offset = 10;

query.getResults(function(error, results) {
  console.log(results.records);
  
  //This call will fetch max 10 records and will start from twenty first record.
  query.next(function(error, results) {
    console.log(results.records);
  });
});
```

#Order by

To fetch records ordered by a specific field, the query object provides the function `orderBy`.  To sort the records in a descending/ascending order you must set asc/desc attribute after call orderBy function.

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(model);
query.add(dc.conditions.like("name", "Eleaz%")).add(dc.conditions.equals("age", 33));

//Every call will fetch max 10 records and will start from eleventh record.
query.count = 10;
query.offset = 1;

query.orderBy("email").asc(); // Here you can call desc() function

query.getResults(function(error, results) {
  console.log(results.records);
});
```

#Group by and Projection

To group by a specifics fields, the query object provides the function `groupBy`.  To use this clause, you must call getResultsWithProjection.

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(model);
query.add(dc.conditions.like("name", "Eleaz%")).add(dc.conditions.equals("age", 33));

//Every call will fetch max 10 records and will start from eleventh record.
query.count = 10;
query.offset = 10;

query.orderBy("email").asc(); // Here you can call desc() function

// These are the fields in your projection
query.groupBy("name, email");

var results = query.getResultsWithProjection(["name", "email"], function(error, results) {
   console.log(results);
});
```
#Functions as a Projection

The getResultsWithProjection allows you to specify the projection.

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(model);

query.add(dc.conditions.like("name", "Eleaz%"));

var results = query.getResultsWithProjection(["avg(age) as average"], function(error, results) {
   console.log(results['average']);
});
```

#Update using selection

There are situations where you need to update records using a specific selection.

In this example we are going to update the `name` where age > 24

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(model);
query.add(dc.conditions.greaterThan("age", 24));

/*
 * This function will use the data object and the query object to update only the records that match with the selection.
 */
provider.updateWithSelection(query, {'name' = 'Eleazar'}, function(error) {
   console.log("Updated!");
});
```

#Delete using selection

There are situations where you need to delete records using a specific selection.

In this example we are going to delete the records where age > 24

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(model);
query.add(dc.conditions.greaterThan("age", 24));

/*
 * This function will use the query object to delete only the records that match with the selection.
 */
provider.deleteWithSelection(query, function(error) {
   console.log("Deleted!");
});
```
