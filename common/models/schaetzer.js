/*eslint-env node */
module.exports = function(Schaetzer) {

	Schaetzer.notSyncedTo = function(opKey, cb) {
	  var SyncModel = Schaetzer.app.models.SyncSchaetzerToOperator;

	  SyncModel.find(
	  {
	  	 where: {and: [  {operatorKey: {neq: opKey}}
	  	               , {sentToOperatorDate: null}]}
	    ,include : {relation: "schaetzer"}	               
	  },
	  function(err, syncArray) { 
	    var result = [];
	    if (syncArray !== null) {
	    	result = syncArray.map(function(currentValue) {
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
        returns: {arg: 'schaetzerList', type: 'Array', root:true}
    	});			

};
