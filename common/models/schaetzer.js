/*eslint-env node */
module.exports = function(Schaetzer) {

	Schaetzer.notSyncedTo = function(opKey, cb) {
	  console.log(JSON.stringify(Schaetzer.app.models)); 
          var SyncModel = Schaetzer.app.models.SchaetzerSyncToOperator;

	  SyncModel.find(
	  {
	  	 where: {and: [  {operatorKey: opKey}
	  	               , {sentToOperatorDate: null}]}
	    ,include : {relation: "schaetzer"}	               
	  },
	  function(err, syncArray) { 
	    console.log(JSON.stringify(syncArray)); 
            var result = [];
	    if (syncArray) {
              result = syncArray.map(function(currentValue) {
    		     console.log("inArray: " + JSON.stringify(currentValue)); 
                     console.log("");
                     console.log(currentValue.schaetzer()); 
                     return currentValue.schaetzer();
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
