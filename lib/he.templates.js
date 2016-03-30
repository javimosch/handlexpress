var heUtils = require('./he.utils');
var Handlebars = require('handlebars');
var readDirFiles = require('read-dir-files');
var mkdirp = require('mkdirp');
var fs = require('fs');

var SRC = './src';
var DIST = './dist';
var PATH = './partials';
var PARTIALS_EXT = 'html';
var partials = null;

var data = { "name": "Alan", "hometown": "Somewhere, TX", "kids": [{ "name": "Jimmy", "age": "12" }, { "name": "Sally", "age": "4" }] };

var _watches = {};

function dataFromRequire(filePath, propertyName) {
    var data = {};
    if (propertyName) {
        data = require(filePath)[propertyName];
    } else {
        data = require(filePath);
    }
    loadData(data);

    if (typeof _watches[filePath] === 'undefined') {
        _watches[filePath] = true;
        try {
            heUtils.watch([filePath + '.js'], () => dataFromRequire(filePath, propertyName));
        } catch (e) {
            console.log('debug-warning','watch hook failed',e);
        }
    }
}

function loadData(d) {
    Object.assign(data, d);
}

function loadDataJSON(path) {
    var data = fs.readFileSync(path);
    loadData(JSON.parse(data));
}


module.exports = {
    dataFromRequire: dataFromRequire,
    loadData: loadData,
    loadDataJSON: loadDataJSON,
    dest: (dest) => {
        DIST = dest;
    },
    watch: () => {
        watchPartials();
        watchSrc();
    },
    build: () => {
        buildTemplatesPartials();
        buildTemplates();
    }
}

function watchSrc() {
    heUtils.watch(SRC, () => {
        buildTemplates();
    });
}

function watchPartials() {
    heUtils.watch(PATH, () => {
        buildTemplatesPartials();
        buildTemplates();
    });
}

function buildTemplatesPartials() {
    partials = heUtils.normalizeFilesTree(readDirFiles.readSync(PATH));
    partials = heUtils.filesIncludeOnly(partials, PARTIALS_EXT);
    var name;
    Object.keys(partials).forEach(k => {
        name = k.substring(0, k.lastIndexOf('.') !== -1 && k.lastIndexOf('.') || undefined);
        console.log('Registering ', name);
        Handlebars.registerPartial(name, partials[k]);
    });
}

function compileTemplates(src, path) {
    console.log('Compiling', path);
    var rta = Handlebars.compile(src)(data);
    return rta;
}

function buildTemplates() {
    if (partials == null) {
        //not ready yet;
        return;
    }
    heUtils.copyFilesFromTo(SRC, DIST, {
        formatPathHandler: (path) => {
            if (path.indexOf('index.') !== -1 && path.indexOf('index.html') == -1) {
                path = path.substring(0, path.lastIndexOf('index.')) + 'index.html';
            }
            return path;
        },
        formatContentHandler: (raw, path) => {
            console.log('Compiling', path);
            try {
                var rta = Handlebars.compile(raw)(data);
            } catch (e) {
                rta = raw;
                //console.log('Compiling fail',e);
                throw e;
            }
            return rta;

        }
    }).then((res) => {
        console.log('Build templates ' + (res.ok ? 'success' : 'with errors') + ' at ' + new Date());
    });

}
