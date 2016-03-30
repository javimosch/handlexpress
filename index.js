var express = require('express');


var heBuild = require('./lib/he').build;
var heWatch = require('./lib/he').watch;
var heOptions = require('./lib/he').options;
var heLoads = require('./lib/he').load;
var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;


heLoads.dataFromRequire(process.cwd()+'/data');

heOptions.dest('./public');
heBuild.all();
heWatch.templates();
heWatch.styles();

/*
var app = express();
app.use('/', express.static('./public'));
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Production? '+(PROD?'Oui!':'Non!'));
  console.log('handlexpress listening on port '+port+'!');
});

*/