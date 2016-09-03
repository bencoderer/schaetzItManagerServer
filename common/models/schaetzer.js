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
		         //console.log("inArray: " + JSON.stringify(currentValue)); 
                 //console.log("");
                 //console.log(currentValue.schaetzer()); 
                 var schaetzer = currentValue.schaetzer();
                 if (schaetzer.operatorKey !== opKey) {
                    return schaetzer;
                 }
              }).filter(function(item) { return item != null;});
	    }
	    cb(err, result);
	  });    
	};


    Schaetzer.isSynced = function(id, opKey, cb) {
      //var SyncModel = Schaetzer.app.models.SchaetzerSyncToOperator;

      var result = "";
    
	  var schaetzer = Schaetzer.findById(id, {
	   
	    include : {
	    	relation: "sync",	               
	    
	        scope: {
	          where: {operatorKey: opKey}
	        }
	      }
	  }, function(err, schaetzer) {

	      if (schaetzer != null) {
	      	console.log(JSON.stringify(schaetzer));
	      	schaetzer.sync({where: {operatorKey: opKey}}, function(err, syncArray) {
	      
			    console.log(JSON.stringify(syncArray)); 
	
			    if (syncArray) {		    
					syncArray[0].sentToOperatorDate = new Date();
					syncArray.save();
					result = syncArray[0].sentToOperatorDate.toISOString();
			    }
			    cb(err, result);
			  });    
		  }
		  else {
		  	cb(err, null);
		  }
	  });
	};



    Schaetzer.remoteMethod(
    	'notSyncedTo', 
    	{
    	accepts: {arg: 'opKey', type: 'string', required: true},
        http: {path: '/notSyncedTo/:opKey', verb: 'get'},
        returns: { type: 'array', root:true}
    	});			

    Schaetzer.remoteMethod(
    	'isSynced', 
    	{
    	accepts: [
    	  {arg: 'id', type: 'string', required: true},
    	  {arg: 'opKey', type: 'string', required: true}
    	],
        http: {path: '/:id/isSynced/:opKey', verb: 'post'},
        returns: { arg: 'sentToOperatorDate', type: 'string'}
    	});	
};
