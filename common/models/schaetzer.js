/*eslint-env node */
module.exports = function(Schaetzer) {

	Schaetzer.notSyncedTo = function(opKey, cb) {
	  console.log(JSON.stringify(Schaetzer.app.models)); 
          var SyncModel = Schaetzer.app.models.SchaetzerSyncToOperator;

	  SyncModel.find(
	  {
	  	 where: {and: [{operatorKey: {neq: opKey}
	  	 ,include : {relation: "schaetzer"}
	  }, {sentToOperatorDate: null}]}},
	  function(err, syncArray) { 
	    console.log(JSON.stringify(syncArray)); 
            var result = [];
	    if (syncArray !== null) {
              result = syncArray.map(function(currentValue) {
    		     console.log(JSON.stringify(currentValue)); 
                     return currentValue.schaetzer;
	    	});
	    }
	    cb(err, result);
	  });    
	};

    Schaetzer.remoteMethod(
    	'notSyncedTo', 
    	{
    	accepts: {arg: 'opKey', type: 'string', required: true},
        http: {path: '/notSyncedTo/:opKey', verb: 'get'},
        returns: { type: 'array', root:true}
    	});			

};
