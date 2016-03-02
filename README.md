# Dynamicloud NodeJs API v1.0.0 (Building process)
This NodeJs API helps you to use the power of Dynamicloud.  This API follows our Rest documentation to execute CRUD operations according to http methods.

#Requirements

NodeJs v4.1.0 or later, you can download it on [NodeJs site](https://nodejs.org/en/download/ "Download NodeJs")

#Installation

You can install this module in your system using the npm command:
 
`npm install dynamicloud`

#NodeJs documentation

To read the NodeJs API documentation click [here](http://www.dynamicloud.org "Dynamicloud NodeJs API documentation")

# Getting started

This API provides components to execute operations on [Dynamicloud](http://www.dynamicloud.org/ "Dynamicloud") servers.  The main components and methods are the followings:

1. [RecordModel](#recordmodel)
2. [RecordCredential](#recordcredential)
3. [BoundInstance](#boundinstance)
4. [@Bind](#annotation-bind)
5. [DynamicProvider](#dynamicprovider)
  1. [DynamicProvider's methods](#methods)
6. [Query](#query-class)
  1. [RecordResults](#recordresults)
  - [Condition](#conditions-class)
  - [Conditions](#conditions-class)
  - [Between condition](#between-condition)
  - [Exists condition](#exists-condition)
  - [Join clause](#join-clause)
  - [Next, Offset and Count methods](#next-offset-and-count-methods)
  - [Order by](#order-by)
  - [Group by and Projection](#group-by-and-projection)
  - [Functions as a Projection](#functions-as-a-projection)
7. [Update using selection](#update-using-selection)
8. [Delete using selection](#delete-using-selection)

These components will allow you to connect on Dynamicloud servers, authenticate and execute operations like *loadRecord*, *updateRecord*, *deleteRecord*, *get record's information according to selection*, *get record's information according to projection*, etc.  The next step is explain every components and how to execute operations.  

# Model

To load records in this API you're going to use a **Model ID**.  Every record belongs to a Model.

#Credential

To gain access in Dynamicloud servers you need to provide the API keys.  These APIs ware provided at moment of your registration.

#DynamicProvider
**DynamicProvider** provides important methods and can be used as follow:
```javascript
var dc = require('dynamicloud');

var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});
```
 
**First, let's explain the initialization method:**
 ```javascript
function buildProvider(credentialObject)
 ```
This method receives an object with the credential to gain access.  The credential object is composed of Client Secret Key (CSK) and Application Client ID (ACI), these keys were provided at moment of your registration.
 
#Methods
 
 **Load Record**
```javascript
/**
 * This method will load a record using recordId.
 *
 * @param recordId        record id
 * @param modelId        model id
 *
 * @return a json object with the data from Dynamicloud
 * @param callback this callback will be called when response it's available.
 */
loadRecord: function (recordId, modelId, callback)
```
This method loads a record according to rid *(RecordID)* in model *(ModelID)*.

**For example, a call of this method would be:**
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
 * This method saves a record into Dynamicloud
 * @param modelId model target
 * @param record record object that will be saved
 *
 * @return the record Id of this new record
 * @param callback this callback will be called when response it's available.  This callback function receives the record with the rid attribute
 */
saveRecord: function (modelId, record, callback)
```
This method saves a record (Object) using the data within it.

**For example, a call of this method would be:**
 ```javascript
provider.saveRecord(modelId, {
    'lonlinetext': 'testing',
    'lonlinelevel': 'debug'
}, function (error, record) {
  // This method will have the record id in Dynamicloud
  console.log(record.rid);
}):
```

**Update Record**
 ```javascript
/**
 * This method will call an update operation in Dynamicloud servers
 * using model and BoundInstance object
 *
 * @param modelId    modelId
 * @param record object that will be saved
 * @param callback this callback will be called when response it's available.
 */
updateRecord: function (modelId, record, callback)
```
This method updates the record (record['rid'])

**For example, a call of this method would be:**
 ```javascript
provider.updateRecord(modelId, record, function (error, record) {
  console.log('Updated record = ' + record['rid']);
}):
```

**Delete Record**
 ```javascript
/**
 * This method will call a delete operation in Dynamicloud servers
 * using model and Record id
 *
 * @param modelId model Id
 * @param recordId   record id
 * @param callback this callback will be called when response it's available.
 */
deleteRecord: function (modelId, recordId, callback)
```
This method deletes a record from the Model

**For example, a call of this method would be:**
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
This method returns a Query to get records according to a specific selection.

**For example, a call of this method would be:**
 ```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);

```

#Query class

This class provides a set of methods to add conditions, order by and group by clauses, projections, etc.

```javascript
function  add(condition);
function  join(condition);
function  asc();
function  desc();
alias=
count=
offset=
orderBy=
groupBy=
function getResultsByProjection(projection, callback);
function next(callback);
```

With the Query object we can add conditions like EQUALS, IN, OR, AND, GREATER THAN, LESSER THAN, etc.  The query object is mutable and every call of its methods will return the same instance.

#Results

**This object provides three attributes:**
- **totalRecords:** The total records in Model
- **fastReturnedSize:** The returned size of records that have matched with Query conditions
- **records:** A list of records.

**The uses of this class would be as a follow:**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);
query.add(dc.conditions.like("name", "Eleaz%"));

/**
* This method will call getResultsByProjection(null, callback)
*/
query.getResults(function(error, results) {
  _.each(results.records, function(item) {
      String email = item.getEmail();
  });
});
```

#Conditions object

This object provides a set of methods to build conditions and add them to the query object
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

To add conditions to a Query object it must call the add method **(query.add(condition))**

**For example:**

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);
query.add(dc.conditions.like("name", "Eleaz%"));
```

Every call of add method in object Query will put the Condition in a ordered list of conditions, that list will be joint as a AND condition.  So, if you add two conditions as follow:

```javascript
var dc = require('dynamicloud');
var provider = dc.buildProvider({csk: 'csk#...', aci: 'aci#...'});

var query = provider.createQuery(modelId);
query.add(dc.conditions.like("name", "Eleaz%"));
 
query.add(dc.conditions.like("name", "Eleaz%")).add(dc.conditions..equals("age", 33));
```

These two calls of add method will produce something like this:

`name like 'Eleazar%' **AND** age = 33`

Query object provides a method called **getResultsWithProjection(callback)**, this method will execute a request using the *ModelId* and *Conditions*. The response from Dynamicloud will be encapsulated in a javascript object.

#Between condition

With this condition you can build selections like **age between 24 and 30** or **birthdate bewteen '2010-01-01 00:00:00' and '2015-11-01 23:59:59'**.

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

```java
DynamicProvider<LangCountBean> provider = new DynamicProviderImpl<>(new RecordCredential(CSK, ACI));

Query query = provider.createQuery(userModel);

/**
* This is the alias to recordModel, this alias is necessary if you need to execute an exists using two models
*/
query.setAlias("u");

ExistsCondition exists = Conditions.exists(vipmodel, "v");

/**
* The dollar symbols are to avoid to use right part as a String, but literally v.user_id = u.id
*/
exists.add(Conditions.equals("v.user_id", "$u.id$"));

query.add(exists);

try {
  RecordResults results = query.list();
  .
  .
  .
} catch (DynamicloudProviderException e) {
  //Oops!! What's wrong mister e?
}
```

**If you want to get the users without vip label:**

```java
DynamicProvider<LangCountBean> provider = new DynamicProviderImpl<>(new RecordCredential(CSK, ACI));

Query query = provider.createQuery(userModel);

/**
* This is the alias to recordModel, this alias is necessary if you need to execute an exists using two models
*/
query.setAlias("u");

ExistsCondition exists = Conditions.notExists(vipmodel, "v");

/**
* The dollar symbols are to avoid to use right part as a String, but literally v.user_id = u.id
*/
exists.add(Conditions.equals("v.user_id", "$u.id$"));

query.add(exists);

try {
  RecordResults results = query.list();
  .
  .
  .
} catch (DynamicloudProviderException e) {
  //Oops!! What's wrong mister e?
}
```

**Another capability in Exists condition is the JoinClauses to execute correlated queries with Joins, for example:**
```sql
SELECT * FROM users u WHERE EXISTS (SELECT * FROM vip_users v JOIN vip_country c ON c.vip_id = v.id WHERE v.user_id = u.id AND c.country_iso = 'BR')
```

```java
DynamicProvider<LangCountBean> provider = new DynamicProviderImpl<>(new RecordCredential(CSK, ACI));

Query query = provider.createQuery(userModel);

/**
* This is the alias to recordModel, this alias is necessary if you need to execute an exists using two models
*/
query.setAlias("u");

ExistsCondition exists = Conditions.exists(vipmodel, "v");

exists.join(Conditions.innerJoin(countryModel, "c", "c.vip_id = v.id"));

/**
* The dollar symbols are to avoid to use right part as a String, but literally v.user_id = u.id
*/
exists.add(Conditions.and(Conditions.equals("v.user_id", "$u.id$"), Conditions.equals("c.country_iso", "BR")));

query.add(exists);

try {
  RecordResults results = query.list();
  .
  .
  .
} catch (DynamicloudProviderException e) {
  //Oops!! What's wrong mister e?
}
```

#Join Clause

With Join Clause you can execute conditions and involve more than one model.  This is useful in situations when you need to compare data between two or more models and get information in one execution.

**A Join Clause is composed by: Model, Type, Alias and ON condition:**

```java
DynamicProvider<LangCountBean> provider = new DynamicProviderImpl<>(new RecordCredential(CSK, ACI));

/**
* Query has the main model 'user'
*/
Query<JoinResultBean> query = provider.createQuery(userModel);

try {
    /**
     * This is the alias to recordModel, this alias is necessary to use JoinClause
     */
    query.setAlias("user");

    /**
     * It is important the receptor bean to attach the results to it.  In this exemple, this bean must declare the userId and 
     * count methods.
     */
    recordModel.setBoundClass(LangCountBean.class);

    query.setProjection(new String[]{"user.id as userid", "count(1) as count"});
    
    /**
    * This is the model 'languages' to join with model 'user'
    */
    RecordModel languagesRecordModel = new RecordModel(...);
    
    /**
    * Conditions class provides: innerJoin, leftJoin, rightJoin, leftOuterJoin and rightOuterJoin.
    * If you need to add more than one join, you have to call query.join(...) and will be added in the query join list.
    *
    * This is an example to get the count of languages of every user.
    */
    query.join(Conditions.innerJoin(languagesRecordModel, "lang", "user.id = lang.userid"));

    /**
    * The Join Clause could be executed using a selection
    */
    query.add(Conditions.greaterThan("user.age", 25));
    
    /**
    * You can group the results to use sum, count, avg, etc.
    */
    query.groupBy("user.id");

    RecordResults<JoinResultBean> results = query.list();
    if (results.getFastReturnedSize() > 0) {
        JoinResultBean bean = results.getRecords().get(0);

        // Code here to manipulate the results
    }
} catch (DynamicloudProviderException ignore) {
}
```

#Next, Offset and Count methods

Query class provides a method to walk across the records of a Model.  Imagine a model with a thousand of records, obviously you shouldn't load the whole set of records, you need to find a way to load a sub-set by demand.

The method to meet this goal is **next**.  Basically, the next method will increase the offset automatically and will execute the request with the previous conditions. By default, offset and count will have 0 and 15 respectively.

**The uses of this method would be as a follow:**

```java
DynamicProvider<ModelField> provider = new DynamicProviderImpl<ModelField>(recordCredential);
recordModel.setBoundClass(ModelField.class);

Query<ModelField> query = provider.createQuery(model);
query.add(Conditions.like("name", "Eleaz%")).add(Conditions.equals("age", 33));

RecordResults results = query.list();
for (ModelField item : results.getRecords()) {
  String email = item.getEmail():
}

results = query.next();

//Loop with the next 15 records
for (ModelField item : results.getRecords()) {
  String email = item.getEmail():
}
```

If you want to set an **offset** or **count**, follow this guideline:

```java
DynamicProvider<ModelField> provider = new DynamicProviderImpl<ModelField>(recordCredential);
recordModel.setBoundClass(ModelField.class);

Query<ModelField> query = provider.createQuery(model);
query.add(Conditions.like("name", "Eleaz%")).add(Conditions.equals("age", 33));

//Every call will fetch max 10 records and will start from eleventh record.
query.setCount(10).setOffset(1);

RecordResults results = query.list();
for (ModelField item : results.getRecords()) {
  String email = item.getEmail();
}

//This call will fetch max 10 records and will start from twenty first record.
results = query.next();

//Loop through the next 10 records
for (ModelField item : results.getRecords()) {
  String email = item.getEmail();
}
```

#Order by

To fetch records ordered by a specific field, the query object provides the method **orderBy**.  To sort the records in a descending/ascending order you must call asc/desc method after call orderBy method.

```java
DynamicProvider<ModelField> provider = new DynamicProviderImpl<ModelField>(recordCredential);
recordModel.setBoundClass(ModelField.class);

Query<ModelField> query = provider.createQuery(model);
query.add(Conditions.like("name", "Eleaz%")).add(Conditions.equals("age", 33));

//Every call will fetch max 10 records and will start from eleventh record.
query.setCount(10).setOffset(1).orderBy("email").asc(); // Here you can call desc() method

RecordResults results = query.list();
for (ModelField item : results.getRecords()) {
  String email = item.getEmail():
}

```

#Group by and Projection

To group by a specifics fields, the query object provides the method **groupBy**.  To use this clause, you must set the projection to the query using **setProjection** method.

```java
DynamicProvider<ModelField> provider = new DynamicProviderImpl<ModelField>(recordCredential);
recordModel.setBoundClass(ModelField.class);

Query<ModelField> query = provider.createQuery(model);
query.add(Conditions.like("name", "Eleaz%")).add(Conditions.equals("age", 33));

//Every call will fetch max 10 records and will start from eleventh record.
query.setCount(10).setOffset(1).orderBy("email").asc(); // Here you can call desc() method

// These are the fields in your projection
query.groupBy("name, email");
query.setProjection(new String[]{"name", "email"});

RecordResults results = query.list();
for (ModelField item : results.getRecords()) {
  String email = item.getEmail():
}

```
#Functions as a Projection

Query object provides the setProjection method to specify the fields you want to fetch in a query.  In this method you can set the function you want to call. Every function must has an alias to bind it with a setMethod in BoundInstance object.

```java
DynamicProvider<ModelField> provider = new DynamicProviderImpl<ModelField>(recordCredential);
recordModel.setBoundClass(ModelField.class);

Query<ModelField> query = provider.createQuery(model);

query.add(Conditions.like("name", "Eleaz%"));
query.setProjection(new String[]{"avg(age) as average"});

ModelField instance = query.list().get(0);
Double average = instance.getAverage();

```

#Update using selection

There are situations where you need to update records using a specific selection.

In this example we are going to update the **name** where age > 24

```java
DynamicProvider<ModelField> provider = new DynamicProviderImpl<ModelField>(recordCredential);

ModelField instance = new ModelField();
instance.setName("Eleazar");

provider.setBoundInstance(instance);

Query<ModelField> query = provider.createQuery(model);
query.add(Conditions.greaterThan("age", 24));

/*
 This method will use the BoundInstance to get the data different than null (in this case the only data to use is **name**)
 and the query object to update only the records that match with the selection.
*/
provider.update(query);
```

#Delete using selection

There are situations where you need to delete records using a specific selection.

In this example we are going to delete the records where age > 24

```java
DynamicProvider<ModelField> provider = new DynamicProviderImpl<ModelField>(recordCredential);

Query<ModelField> query = provider.createQuery(model);
query.add(Conditions.greaterThan("age", 24));

/*
 This method will delete the records that match with the selection.
*/
provider.delete(query);
```
 
