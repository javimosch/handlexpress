var heStyles = require('./he.styles');
var heTpls   = require('./he.templates');

exports.load={
    dataFromRequire:heTpls.dataFromRequire,
    data:heTpls.loadData,
    json:heTpls.loadJSON
};

exports.options={
    dest:(dest)=>{
        heStyles.dest(dest);
        heTpls.dest(dest);
    }
};

exports.watch={
    templates:heTpls.watch,
    styles:heStyles.watch
};

exports.build={
    all:build
};

function build(){
    heStyles.build();
    heTpls.build();
    console.log('Build all success at ' + new Date());
}



