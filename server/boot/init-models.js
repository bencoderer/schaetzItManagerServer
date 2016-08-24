/*eslint-env node */
var async = require('async');
module.exports = function(app) {
  //data sources
  var mongodbsvr = app.dataSources.mongodbsvr;
  var mysqldbsvr = app.dataSources.mysqldbsvr;
  
  //create all models
  async.parallel({
    operators: async.apply(createOperators),
    schaetzers: async.apply(createSchaetzers),
    //schaetzungen: async.apply(createSchaetzungen), //be embedded
    schaetzerSyncToOperators: async.apply(createSchaetzerSyncToOperators),
  }, function(err, results) {
    if (err) throw err;
    
      console.log('> models created sucessfully');
    
  });
  //create operators
  function createOperators(cb) {
    mysqldbsvr.automigrate('Operator', function(err) {
      if (err) return cb(err);
      var Operator = app.models.Operator;
      Operator.create([
        {operatorKey: 'OP1', name: 'Tablet 1'},
        {operatorKey: 'OP2', name: 'Tablet 2'}
      ], cb);
    });
  }
  
  //create schaetzer
  function createSchaetzers(cb) {
    mysqldbsvr.automigrate('Schaetzer', function(err) {
      if (err) return cb(err);
    });
  }
  
  //create schaetzung
  function createSchaetzungen(cb) {
    mysqldbsvr.automigrate('Schaetzung', function(err) {
      if (err) return cb(err);
    });
  }
  
  //create schaetzung
  function createSchaetzerSyncToOperators(cb) {
    mysqldbsvr.automigrate('SchaetzerSyncToOperator', function(err) {
      if (err) return cb(err);
    });
  }

};