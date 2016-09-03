/*eslint-env node */
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});


//Sample # 2 - bit more advanced
// Also helps track reponse time for all URLs
app.middleware('initial', function logResponse(req, res, next) {
  // http://www.senchalabs.org/connect/responseTime.html
  var start = new Date;
  if (res._responseTime) {
    return next();
  }
  res._responseTime = true;

  // install a listener for when the response is finished
  res.on('finish', function() { // the request was handled, print the log entry
    var duration = new Date - start;
    console.log(req.method, req.originalUrl, res.statusCode, duration + 'ms', {
      lbHttpMethod:req.method,
      lbUrl:req.originalUrl,
      lbbody:req.body,
      lbStatusCode:res.statusCode,
      lbResponseTime:duration
    });
  });

  // resume the routing pipeline,
  // let other middleware to actually handle the request
  next();
});
