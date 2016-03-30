var heUtils = require('./he.utils');


var PATH = './css';
var DIST = './dist/css';
var DEST_FOLDER = 'css';

function watch(){
	heUtils.watch(PATH,()=>{
		build();
	});
}
function build(){
	heUtils.copyFilesFromTo(PATH,DIST,{
		formatContentHandler:(raw)=>{
			return raw; //less, sass, stylus here.
		}
	});
	console.log('Building styles success at ' + new Date());
}


module.exports = {
	dest:(dest)=>{
		DIST = dest + '/' + DEST_FOLDER;
	},
	build:build,
	watch:watch
};
