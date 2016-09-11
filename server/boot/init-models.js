/*eslint-env node */
var async = require('async');
module.exports = function(app) {
  //data sources
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
    mysqldbsvr.autoupdate('Operator', function(err) {
      if (err) return cb(err);
      var Operator = app.models.Operator;
      Operator.findOrCreate({where: {operatorKey : 'OP1'}}, 
        {operatorKey: 'OP1', name: 'Tablet 1'}
      , function(err) {
           if (err) return cb(err);
           Operator.findOrCreate({where:{operatorKey : 'OP2'}},
            {operatorKey: 'OP2', name : 'Tablet 2'}, cb); 
        });
    });
  }
  
  //create schaetzer
  function createSchaetzers(cb) {
    mysqldbsvr.autoupdate('Schaetzer', function(err) {
      if (err) return cb(err);
    });
  }
  
  //create schaetzung
  function createSchaetzungen(cb) {
    mysqldbsvr.autoupdate('Schaetzung', function(err) {
      if (err) return cb(err);
    });
  }
  
  //create schaetzung
  function createSchaetzerSyncToOperators(cb) {
    mysqldbsvr.autoupdate('SchaetzerSyncToOperator', function(err) {
      if (err) return cb(err);
    });
  }

};
